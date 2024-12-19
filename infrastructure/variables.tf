variable "github_token" {
  description = "GitHub OAuth token for AWS Amplify"
  type        = string
  sensitive   = true
}

variable "next_public_api_url" {
  description = "Public API URL for the Next.js app"
  type        = string
}

variable "region" {
  description = "AWS region for deployment"
  default     = "us-east-2"
}
