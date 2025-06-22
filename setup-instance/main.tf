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

    // No public IP (no access_config)
  }

  # For firewall rules
  tags = ["allow-health-check"]

  metadata = {
    // Allow SSH connection via gcloud
    enable-oslogin = "TRUE"
  }
}

###### LOAD BALANCER STUFF NEEDED TO GET HTTPS WORKING - THANK YOU CHATGPT ######
resource "google_compute_instance_group" "app_ig" {
  name = "${var.instance_name}-ig"
  zone = google_compute_instance.app_instance.zone
  instances = [google_compute_instance.app_instance.self_link]

  named_port {
    name = "http"
    port = 8080
  }
}

resource "google_compute_health_check" "http" {
  name = "http-hc"
  http_health_check { port = 8080 }
}

resource "google_compute_firewall" "allow_lb_health_checks" {
  name    = "lb-allow-hc"
  network = "default"
  direction = "INGRESS"
  source_ranges = ["35.191.0.0/16", "130.211.0.0/22"]  # Google LB probes
  target_tags   = ["allow-health-check"]

  allow {
    protocol = "tcp"
    ports = ["8080"]
  }
}

resource "google_compute_backend_service" "app_backend" {
  name                  = "app-backend"
  protocol              = "HTTP"
  port_name             = "http"
  load_balancing_scheme = "EXTERNAL"
  backend               {
    group = google_compute_instance_group.app_ig.self_link
  }
  health_checks         = [google_compute_health_check.http.self_link]
  enable_cdn            = false  # Disabled for WebSocket compatibility

  # Session affinity for Socket.IO
  session_affinity      = "CLIENT_IP"
  affinity_cookie_ttl_sec = 3600

  # Timeout settings for WebSocket connections
  timeout_sec           = 3600  # 1 hour timeout for long-lived connections
}

resource "google_compute_url_map" "app_map" {
  name            = "app-url-map"
  default_service = google_compute_backend_service.app_backend.self_link
}

resource "google_compute_global_address" "lb_ip" {
  name = "lb-ip"
}

locals {
  lb_domain = "${google_compute_global_address.lb_ip.address}.sslip.io"
}

resource "google_compute_managed_ssl_certificate" "lb_cert" {
  name = "lb-cert"
  managed { domains = [local.lb_domain] }
}

resource "google_compute_target_https_proxy" "app_proxy" {
  name             = "app-https-proxy"
  url_map          = google_compute_url_map.app_map.self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.lb_cert.self_link]
}

resource "google_compute_global_forwarding_rule" "https_rule" {
  name                  = "https-fwd"
  load_balancing_scheme = "EXTERNAL"
  port_range            = "443"
  target                = google_compute_target_https_proxy.app_proxy.self_link
  ip_address            = google_compute_global_address.lb_ip.address
}

output "lb_domain" {
  value = local.lb_domain
}

####### NAT STUFF SO WE CAN DOWNLOAD PACKAGES ETC - THANKS AGAIN CHATGPT #######
resource "google_compute_router" "nat_router" {
  name    = "nat-router"
  network = google_compute_instance.app_instance.network_interface.0.network
}

resource "google_compute_router_nat" "nat_gw" {
  name                               = "nat-gateway"
  router                             = google_compute_router.nat_router.name
  region                             = google_compute_router.nat_router.region

  # Let Google grab/rotate the external addresses automatically
  nat_ip_allocate_option             = "AUTO_ONLY"

  # Apply NAT to every subnet in the region (simplest)
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  # Optional-but-useful logging
  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}
