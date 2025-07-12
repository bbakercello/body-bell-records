terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable Firestore API
resource "google_project_service" "firestore" {
  service            = "firestore.googleapis.com"
  disable_on_destroy = false
}

# Create Firestore database
resource "google_firestore_database" "database" {
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.firestore]
}

# Cloud Run Service
resource "google_cloud_run_service" "service" {
  name     = var.app_name
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/${var.app_name}:latest"

        env {
          name  = "FIRESTORE_PROJECT_ID"
          value = var.project_id
        }
      }
    }
  }
}

# Allow unauthenticated access to Cloud Run
resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.service.name
  location = google_cloud_run_service.service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Domain mapping for custom subdomain
resource "google_cloud_run_domain_mapping" "domain_mapping" {
  name     = "bodybellrecords"
  location = var.region

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_service.service.name
  }
}

# Output the Cloud Run URL
output "cloud_run_url" {
  value = google_cloud_run_service.service.status[0].url
}

# Output the custom domain URL
output "custom_domain_url" {
  value = "https://${google_cloud_run_domain_mapping.domain_mapping.name}.run.app"
}
