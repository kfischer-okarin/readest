#!/bin/bash
# Update script for Readest - pulls latest code, builds, and restarts

set -e

echo "=== Readest Update Script ==="

# Navigate to the project directory
cd ~/readest

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Stop the running application
echo "1. Stopping application..."
pm2 stop readest || true

# Pull latest changes
echo "2. Pulling latest changes..."
git pull origin $CURRENT_BRANCH

# Update submodules
echo "3. Updating submodules..."
git submodule update --init --recursive

# Install/update dependencies
echo "4. Installing dependencies..."
pnpm install

# Build the application
echo "5. Building application..."
cd apps/readest-app
pnpm build

# Restart the application
echo "6. Restarting application..."
pm2 restart readest

# Show application status
echo "7. Application status:"
pm2 status readest

echo "=== Update complete! ==="
echo "View logs with: pm2 logs readest"