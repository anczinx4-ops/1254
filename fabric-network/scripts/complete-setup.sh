#!/bin/bash

# Complete setup script for HerbionYX Fabric Network

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 HerbionYX Fabric Network Complete Setup${NC}"
echo "=============================================="

# Step 1: Setup Docker
echo -e "${YELLOW}Step 1: Setting up Docker...${NC}"
./setup-docker.sh

# Step 2: Fix chaincode
echo -e "${YELLOW}Step 2: Setting up chaincode...${NC}"
./fix-chaincode.sh

# Step 3: Clean up any existing network
echo -e "${YELLOW}Step 3: Cleaning up existing network...${NC}"
./network.sh down 2>/dev/null || true
docker system prune -f

# Step 4: Generate certificates
echo -e "${YELLOW}Step 4: Generating certificates...${NC}"
./generate-certs.sh

# Step 5: Start network
echo -e "${YELLOW}Step 5: Starting Fabric network...${NC}"
./network.sh up

# Step 6: Create channel
echo -e "${YELLOW}Step 6: Creating channel...${NC}"
./network.sh createChannel

# Step 7: Deploy chaincode
echo -e "${YELLOW}Step 7: Deploying chaincode...${NC}"
./network.sh deployCC

echo -e "${GREEN}🎉 HerbionYX Fabric Network Setup Complete!${NC}"
echo ""
echo -e "${GREEN}Network Status:${NC}"
echo "- Orderer: orderer.herbionyx.com:7050"
echo "- Peer: peer0.org1.herbionyx.com:7051"
echo "- CouchDB: localhost:5984"
echo "- Channel: herbionyx-channel"
echo "- Chaincode: herbionyx-chaincode"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "1. Start the backend server: cd ../server && npm run dev"
echo "2. Start the frontend: cd .. && npm run dev"
echo "3. Access the application at http://localhost:5173"