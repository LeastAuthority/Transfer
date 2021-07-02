/*
 * Allow credentials self-management.
 */
resource "aws_iam_group" "all_users" {
  name = "AllUsers"
}

resource "aws_iam_group_membership" "all-users-team" {
  name = "all-users-team-membership"
  group = aws_iam_group.all_users.name

  users = [
    aws_iam_user.bryan_white.name,
  ]
}

resource "aws_iam_group_policy" "all-users-policy" {
  name = "all-users-policy"
  group = aws_iam_group.all_users.name

  policy = file("all_users_policy.json")
}
