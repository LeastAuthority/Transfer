terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = "eu-central-1"
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
  alias = "us-east-1"
}

/*
 * BEGIN IAM & ACM
 */

// Bryan White <bryan@leastauthority.com>
resource "aws_iam_user" "bryan_white" {
  name = "bryan.white"
}

resource "aws_iam_user_login_profile" "bryan_white" {
  user    = aws_iam_user.bryan_white.name
  pgp_key = "keybase:bryanchriswhite"
  password_reset_required = false
}

output "password_bryan_white" {
  value = aws_iam_user_login_profile.bryan_white.encrypted_password
}

// Create a group for dns admins.
resource "aws_iam_group" "production_dns_admins" {
  name = "ProductionDNSAdmins"
}

// Add some users to the group.
resource "aws_iam_group_membership" "production_dns_admins" {
  name = "production_dns_admins"

  group = aws_iam_group.production_dns_admins.name

  users = [
    aws_iam_user.bryan_white.name,
  ]
}

// Attach a policy to the group so membership confers some privileges.
resource "aws_iam_group_policy_attachment" "production_dns_admins" {
  group      = aws_iam_group.production_dns_admins.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonRoute53FullAccess"
}

// Support managing MW4ALL website infrastructure.
resource "aws_iam_group" "mw4all_website" {
  name = "mw4all-website"
}

resource "aws_iam_group_membership" "m4wall_website_team" {
  name = "m4wall-website-team"
  group = aws_iam_group.mw4all_website.name
  users = [
    aws_iam_user.bryan_white.name
  ]
}

// Set up the distribution / CDN
resource "aws_iam_group_policy_attachment" "mw4all_website_cloudfront" {
  group = aws_iam_group.mw4all_website.name
  policy_arn = "arn:aws:iam::aws:policy/CloudFrontFullAccess"
}

// Manage certificates
resource "aws_iam_group_policy_attachment" "mw4all_website_certificates" {
  group = aws_iam_group.mw4all_website.name
  policy_arn = "arn:aws:iam::aws:policy/AWSCertificateManagerFullAccess"
}

// ACM certificates
# https://www.terraform.io/docs/providers/aws/r/acm_certificate.html
resource "aws_acm_certificate" "mw4all_website_test" {
  // NB: CloudFront requires certificates to be in us-east-1 region.
  provider = aws.us-east-1

  domain_name               = "test.winden.la.bryanchriswhite.com"
//  subject_alternative_names =  ["www.test.winden.la.bryanchriswhite.com"]
  validation_method         = "DNS"

  tags = {
    Environment = "test"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# https://www.terraform.io/docs/providers/aws/d/acm_certificate.html
data "aws_acm_certificate" "mw4all_website_test_arn" {
  // NB: CloudFront requires certificates to be in us-east-1 region.
  provider = aws.us-east-1

  domain   = "test.winden.la.bryanchriswhite.com"
  statuses = ["ISSUED"]
}

/*
 * END IAM & ACM
 */

/*
 * BEGIN DNS, S3, CDF
 */

// DNS zone & records
resource "aws_route53_zone" "root" {
  name = "la.bryanchriswhite.com."
}

resource "aws_route53_record" "mw4all_website_test" {
  zone_id = aws_route53_zone.root.zone_id
  name    = "test.winden.la.bryanchriswhite.com."
  type    = "A"

  alias {
    name = aws_cloudfront_distribution.mw4all_website_test.domain_name
    zone_id = aws_cloudfront_distribution.mw4all_website_test.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "mw4all_production_mailbox" {
  zone_id = aws_route53_zone.root.zone_id
  name    = "mailbox.winden.la.bryanchriswhite.com."
  type    = "A"
  ttl     = "300"
  records = ["152.228.133.151"]
}

resource "aws_route53_record" "mw4all_production_relay" {
  zone_id = aws_route53_zone.root.zone_id
  name    = "relay.winden.la.bryanchriswhite.com."
  type    = "A"
  ttl     = "300"
  records = ["152.228.133.151"]
}

// S3 Bucket (public)
resource "aws_s3_bucket" "mw4all_website_test" {
  bucket = "test.winden.la.bryanchriswhite.com"
//  region = "eu-central-1"
  acl    = "public-read"
  policy = file("mw4all_website_test_policy.json")

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

// CloudFront distribution
locals {
  origin_id = "test.winden.la.bryanchriswhite.com"
  # bucket_regional_domain_name should construct the right string for us but it gives the non-regional name instead.
//  s3_website_domain_name = aws_s3_bucket.mw4all_website_test.bucket
  s3_website_domain_name = "${aws_s3_bucket.mw4all_website_test.id}.s3.amazonaws.com"
  acm_certificate_arn = data.aws_acm_certificate.mw4all_website_test_arn.arn
}

resource "aws_cloudfront_distribution" "mw4all_website_test" {
  origin {
    domain_name = local.s3_website_domain_name
    origin_id = local.origin_id
  }

  enabled = true
  is_ipv6_enabled = true
  comment = "Test terraform deployment for Winden production (test.winden.la.bryanchriswhite.com)"

  aliases = ["test.winden.la.bryanchriswhite.com"]

  default_root_object = "index.html"

  custom_error_response {
    error_code = 403
    response_code = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code = 404
    response_code = 200
    response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods = ["HEAD", "GET"]
    cached_methods = ["HEAD", "GET"]
    target_origin_id = local.origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      locations = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = local.acm_certificate_arn
    ssl_support_method = "sni-only"
  }
}

/*
 * END S3 & CDF
 */
