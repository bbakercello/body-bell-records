# Provider configuration for AWS
provider "aws" {
  region = "us-east-2" # Ensure this matches your desired region
}

# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_state_lock" {
  name         = "body-bell-records"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  hash_key  = "pk"
  range_key = "sk"

  point_in_time_recovery {
    enabled = false
  }

  stream_enabled = false

  ttl {
    enabled = false
  }

  lifecycle {
    prevent_destroy = true
  }
}

# S3 bucket for Terraform state storage
resource "aws_s3_bucket" "terraform_state" {
  bucket = "body-bell-records-tf-state"

  lifecycle {
    prevent_destroy = true
  }
}

# Define the ACL as a separate resource
resource "aws_s3_bucket_acl" "terraform_state_acl" {
  bucket = aws_s3_bucket.terraform_state.id
  acl    = "private"
}

# Define the versioning configuration as a separate resource
resource "aws_s3_bucket_versioning" "terraform_state_versioning" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Define the server-side encryption configuration as a separate resource
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state_encryption" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Amplify App for Next.js
resource "aws_amplify_app" "nextjs" {
  name        = "NextJSApp"
  repository  = "https://github.com/your-user/your-nextjs-repo" # Replace with your repository URL
  oauth_token = var.github_token # Store securely

  build_spec = <<EOT
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - .npm/**/*
EOT

  environment_variables = {
    NEXT_PUBLIC_API_URL = var.next_public_api_url # Pass environment variable
    ENVIRONMENT = "production"
  }
}

# Amplify Branch for "main"
resource "aws_amplify_branch" "main" {
  app_id              = aws_amplify_app.nextjs.id
  branch_name         = "main"
  enable_auto_build   = true

  environment_variables = {
    NEXT_PUBLIC_API_URL = var.next_public_api_url
    ENVIRONMENT = "production"
  }
}


# Outputs for DynamoDB and S3
output "dynamodb_table_name" {
  value = aws_dynamodb_table.terraform_state_lock.name
}

output "dynamodb_table_arn" {
  value = aws_dynamodb_table.terraform_state_lock.arn
}

output "s3_bucket_name" {
  value = aws_s3_bucket.terraform_state.bucket
}

# Outputs for Amplify App
output "amplify_app_id" {
  value = aws_amplify_app.nextjs.id
}

output "amplify_default_domain" {
  value = aws_amplify_app.nextjs.default_domain
}
