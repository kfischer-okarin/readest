#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <instance_name>"
  exit 1
fi

INSTANCE_NAME=$1
MACHINE_TYPE="e2-standard-2"
BOOT_DISK_NAME="app"
BOOT_DISK_SIZE="10GB"
IMAGE_FAMILY="debian-12"
IMAGE_PROJECT="debian-cloud"
TAGS="https-server"

gcloud compute instances create "$INSTANCE_NAME" \
  --machine-type="$MACHINE_TYPE" \
  --boot-disk-device-name="$BOOT_DISK_NAME" \
  --boot-disk-size="$BOOT_DISK_SIZE" \
  --boot-disk-type=pd-balanced \
  --image-family="$IMAGE_FAMILY" \
  --image-project="$IMAGE_PROJECT" \
  --tags="$TAGS" \
  --shielded-vtpm \
  --shielded-integrity-monitoring \
  --metadata=enable-osconfig=TRUE