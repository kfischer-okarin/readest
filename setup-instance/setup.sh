#!/bin/bash
# Setup script for Readest on Google Compute Engine

set -e

echo "=== Readest GCE Setup Script ==="

# Update system packages
echo "1. Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 22 via NodeSource
echo "2. Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
echo "3. Installing pnpm..."
curl -fsSL https://get.pnpm.io/install.sh | sh -
export PNPM_HOME="$HOME/.local/share/pnpm"
export PATH="$PNPM_HOME:$PATH"
echo 'export PNPM_HOME="$HOME/.local/share/pnpm"' >> ~/.bashrc
echo 'export PATH="$PNPM_HOME:$PATH"' >> ~/.bashrc

# Install git
echo "4. Installing git..."
sudo apt-get install -y git

# Clone the repository
echo "5. Cloning repository..."
cd ~
if [ ! -d "readest" ]; then
  if [ -f "token" ]; then
    git clone --recurse-submodules -b google-cloud-japan-ai-hackathon-vol2 https://kfischer-okarin:$(cat token)@github.com/kfischer-okarin/readest.git
  else
    echo "Token file not found. Please create a token file and try again."
    exit 1
  fi
fi
cd readest

# Initialize git submodules
echo "6. Initializing git submodules..."
git submodule update --init --recursive

# Install dependencies
echo "7. Installing dependencies..."
pnpm install

# Setup PDF.js
echo "8. Setting up PDF.js..."
pnpm --filter @readest/readest-app setup-pdfjs

# Build the application
echo "9. Building application..."
cd apps/readest-app
pnpm build-web

# Install PM2 for process management
echo "10. Installing PM2..."
sudo npm install -g pm2

# Create PM2 ecosystem file
echo "11. Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'readest',
    script: 'server.js',
    cwd: '/home/${USER}/readest/apps/readest-app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_APP_PLATFORM: 'web',
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    time: true
  }]
}
EOF

# Setup nginx as reverse proxy
echo "12. Installing and configuring nginx..."
sudo apt-get install -y nginx

# Create nginx configuration
sudo tee /etc/nginx/sites-available/readest << 'EOF'
server {
    listen 8080;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO specific configuration
    location /socket.io/ {
        proxy_pass http://localhost:3000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Socket.IO specific settings
        proxy_buffering off;
        proxy_set_header X-NginX-Proxy true;
        proxy_redirect off;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/readest /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Start the application with PM2
echo "13. Starting application with PM2..."
pm2 stop readest || true
pm2 delete readest || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER