#!/bin/bash

# Setup Docker for Hyperledger Fabric on WSL2

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐳 Setting up Docker for Hyperledger Fabric${NC}"
echo "=============================================="

# Check if running on WSL
if grep -qi microsoft /proc/version; then
    echo -e "${YELLOW}Detected WSL environment${NC}"
    
    # Check if Docker Desktop is running
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running${NC}"
        echo -e "${YELLOW}Please start Docker Desktop on Windows and ensure WSL2 integration is enabled${NC}"
        echo ""
        echo "Steps to fix:"
        echo "1. Start Docker Desktop on Windows"
        echo "2. Go to Settings > Resources > WSL Integration"
        echo "3. Enable integration with your WSL2 distro"
        echo "4. Apply & Restart Docker Desktop"
        exit 1
    fi
    
    # Check Docker socket permissions
    if ! docker ps > /dev/null 2>&1; then
        echo -e "${YELLOW}Fixing Docker socket permissions...${NC}"
        sudo chmod 666 /var/run/docker.sock 2>/dev/null || true
    fi
else
    echo -e "${YELLOW}Detected native Linux environment${NC}"
    
    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}Installing Docker...${NC}"
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        
        echo -e "${YELLOW}Please log out and log back in for Docker group changes to take effect${NC}"
        exit 0
    fi
    
    # Start Docker service
    if ! systemctl is-active --quiet docker; then
        echo -e "${YELLOW}Starting Docker service...${NC}"
        sudo systemctl start docker
        sudo systemctl enable docker
    fi
fi

# Test Docker
echo -e "${YELLOW}Testing Docker...${NC}"
if docker run --rm hello-world > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is working correctly${NC}"
else
    echo -e "${RED}❌ Docker test failed${NC}"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo -e "${GREEN}✅ Docker setup completed successfully!${NC}"
echo -e "${GREEN}Docker version: $(docker --version)${NC}"
echo -e "${GREEN}Docker Compose version: $(docker-compose --version)${NC}"