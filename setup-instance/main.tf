terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.40"
    }
  }
}

provider "google" {}

variable "instance_name" {
  description = "Name of the compute instance"
  type        = string
}

resource "google_service_account" "default" {
  account_id   = "app-instance-sa"
  display_name = "App Instance SA"
}

resource "google_compute_instance" "app_instance" {
  name         = var.instance_name
  machine_type = "e2-standard-2"
  allow_stopping_for_update = true

  service_account {
    email = google_service_account.default.email
    scopes = [
      "cloud-platform"
    ]
  }

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
    }
  }

  network_interface {
    network = "default"

    access_config {
      // Ephemeral public IP
    }
  }

  metadata = {
    // Allow SSH connection via gcloud
    enable-oslogin = "TRUE"
  }
}
