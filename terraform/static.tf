terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

provider "aws" {
  profile = "default"
  region = "eu-central-1"
}

provider "aws" {
  profile = "default"
  region = "us-east-1"
  alias = "us-east-1"
}

/*
 * BEGIN IAM & ACM
 */

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
    aws_iam_user.ram_muthukrishnan.name,
  ]
}

// Attach a policy to the group so membership confers some privileges.
resource "aws_iam_group_policy_attachment" "production_dns_admins" {
  group = aws_iam_group.production_dns_admins.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonRoute53FullAccess"
}

// Support managing MW4ALL website infrastructure.
resource "aws_iam_group" "winden_website" {
  name = "winden-website"
}

resource "aws_iam_group_membership" "winden_website_team" {
  name = "winden-website-team"
  group = aws_iam_group.winden_website.name
  users = [
    aws_iam_user.bryan_white.name,
    aws_iam_user.ram_muthukrishnan.name,
  ]
}

// Set up the distribution / CDN
resource "aws_iam_group_policy_attachment" "winden_website_cloudfront" {
  group = aws_iam_group.winden_website.name
  policy_arn = "arn:aws:iam::aws:policy/CloudFrontFullAccess"
}

// Manage S3 bucket
resource "aws_iam_group_policy" "winden_website_s3" {
  group = aws_iam_group.winden_website.name
  policy = file("winden_website_group_policy.json")
}

// Manage certificates
resource "aws_iam_group_policy_attachment" "winden_website_certificates" {
  group = aws_iam_group.winden_website.name
  policy_arn = "arn:aws:iam::aws:policy/AWSCertificateManagerFullAccess"
}

// ACM certificates
# https://www.terraform.io/docs/providers/aws/r/acm_certificate.html
resource "aws_acm_certificate" "winden_website" {
  // NB: CloudFront requires certificates to be in us-east-1 region.
  provider = aws.us-east-1

  domain_name = "w.leastauthority.com"
  //  subject_alternative_names =  ["www.w.leastauthority.com"]
  validation_method = "DNS"

  tags = {
    Environment = "production"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# https://www.terraform.io/docs/providers/aws/d/acm_certificate.html
data "aws_acm_certificate" "mw4all_website_test_arn" {
  // NB: CloudFront requires certificates to be in us-east-1 region.
  provider = aws.us-east-1

  domain   = "w.leastauthority.com"
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
  name = "w.leastauthority.com."
}

resource "aws_route53_record" "winden_website" {
  zone_id = aws_route53_zone.root.zone_id
  name    = "w.leastauthority.com."
  type    = "A"

  alias {
    name = aws_cloudfront_distribution.winden_website.domain_name
    zone_id = aws_cloudfront_distribution.winden_website.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "winden_production_mailbox" {
  zone_id = aws_route53_zone.root.zone_id
  name = "mailbox.w.leastauthority.com."
  type = "A"
  ttl = "300"
  records = [
    "152.228.133.151"]
}

resource "aws_route53_record" "winden_production_relay" {
  zone_id = aws_route53_zone.root.zone_id
  name = "relay.w.leastauthority.com."
  type = "A"
  ttl = "300"
  records = [
    "152.228.133.151"]
}

resource "aws_route53_record" "winden_hooks_endpoint" {
  zone_id = aws_route53_zone.root.zone_id
  name = "hooks.w.leastauthority.com."
  type = "A"
  ttl = "300"
  records = [
    "152.228.133.151"]
}

// S3 Bucket (public)
resource "aws_s3_bucket" "winden_website" {
  bucket = "w.leastauthority.com"
  //  region = "eu-central-1"
  acl = "public-read"
  policy = file("winden_website_policy.json")

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

// CloudFront distribution
locals {
  origin_id = "w.leastauthority.com"
  # bucket_regional_domain_name should construct the right string for us but it gives the non-regional name instead.
//  s3_website_domain_name = aws_s3_bucket.mw4all_website_test.bucket
  s3_website_domain_name = "${aws_s3_bucket.winden_website.id}.s3.amazonaws.com"
  acm_certificate_arn = data.aws_acm_certificate.mw4all_website_test_arn.arn
}

resource "aws_cloudfront_distribution" "winden_website" {
  origin {
    domain_name = local.s3_website_domain_name
    origin_id = local.origin_id
  }

  enabled = true
  is_ipv6_enabled = true
  comment = "Winden temp production (w.leastauthority.com)"

  aliases = ["w.leastauthority.com"]

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
