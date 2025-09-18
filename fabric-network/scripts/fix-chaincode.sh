#!/bin/bash

# Fix chaincode packaging and installation issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Fixing Chaincode Issues${NC}"
echo "================================"

# Ensure chaincode directory exists and has proper structure
echo -e "${YELLOW}1. Setting up chaincode directory structure...${NC}"
mkdir -p ../chaincode
cd ../chaincode

# Ensure package.json exists with proper dependencies
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}Creating package.json...${NC}"
    cat > package.json << 'EOF'
{
  "name": "herbionyx-chaincode",
  "version": "1.0.0",
  "description": "HerbionYX Ayurvedic Herb Traceability Chaincode",
  "main": "index.js",
  "scripts": {
    "start": "fabric-chaincode-node start",
    "test": "mocha test --recursive"
  },
  "dependencies": {
    "fabric-contract-api": "^2.5.4",
    "fabric-shim": "^2.5.4"
  },
  "devDependencies": {
    "mocha": "^10.2.0",
    "chai": "^4.3.7"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF
fi

# Ensure index.js exists
if [ ! -f "index.js" ]; then
    echo -e "${YELLOW}Copying chaincode from fabric-network directory...${NC}"
    cp index.js . 2>/dev/null || echo "index.js already exists or not found in fabric-network"
fi

# Install dependencies
echo -e "${YELLOW}2. Installing chaincode dependencies...${NC}"
npm install

# Create .fabricignore file
echo -e "${YELLOW}3. Creating .fabricignore file...${NC}"
cat > .fabricignore << 'EOF'
node_modules/
.git/
.gitignore
README.md
test/
coverage/
.nyc_output/
EOF

cd ../scripts

echo -e "${GREEN}✅ Chaincode setup completed!${NC}"
echo -e "${GREEN}Chaincode is ready for packaging and deployment${NC}"