#!/bin/bash

# Test connectivity script for HerbionYX Fabric Network

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔍 Testing HerbionYX Fabric Network Connectivity${NC}"
echo "=================================================="

# Check if containers are running
echo -e "${YELLOW}1. Checking container status...${NC}"
CONTAINERS=("orderer.herbionyx.com" "peer0.org1.herbionyx.com" "cli" "couchdb0")

for container in "${CONTAINERS[@]}"; do
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        echo -e "✅ ${container} is running"
    else
        echo -e "❌ ${container} is not running"
        exit 1
    fi
done

# Wait for CLI container to be ready
echo -e "\n${YELLOW}2. Waiting for CLI container to be ready...${NC}"
for i in {1..120}; do
    if docker exec cli bash -c "which nc && nc -h" > /dev/null 2>&1; then
        echo -e "✅ CLI container is ready with network utilities"
        break
    fi
    if [ $i -eq 120 ]; then
        echo -e "❌ CLI container setup timeout"
        echo -e "${YELLOW}Checking CLI container logs...${NC}"
        docker logs cli --tail 20
        exit 1
    fi
    echo "Waiting for CLI container setup... ($i/120)"
    sleep 2
done

# Additional verification
echo -e "\n${YELLOW}2.1. Verifying network utilities installation...${NC}"
docker exec cli bash -c "
    echo 'Available network tools:' &&
    which nc && echo 'nc: OK' &&
    which ping && echo 'ping: OK' &&
    which curl && echo 'curl: OK' &&
    which telnet && echo 'telnet: OK'
" || {
    echo -e "❌ Network utilities not properly installed"
    echo -e "${YELLOW}Attempting to reinstall...${NC}"
    docker exec cli bash -c "
        apt-get update -qq &&
        apt-get install -y -qq netcat-openbsd telnet iputils-ping curl
    "
}

# Test network connectivity
echo -e "\n${YELLOW}3. Testing network connectivity...${NC}"

# Test orderer connectivity
echo -e "${YELLOW}3.1. Testing orderer connectivity...${NC}"
if docker exec cli timeout 10 nc -z orderer.herbionyx.com 7050 2>/dev/null; then
    echo -e "✅ Orderer reachable on port 7050"
elif docker exec cli timeout 10 telnet orderer.herbionyx.com 7050 </dev/null 2>/dev/null | grep -q "Connected"; then
    echo -e "✅ Orderer reachable on port 7050 (via telnet)"
else
    echo -e "❌ Cannot reach orderer on port 7050"
    echo -e "${YELLOW}Debugging orderer connectivity...${NC}"
    docker exec cli bash -c "
        echo 'Checking orderer container status:' &&
        nslookup orderer.herbionyx.com &&
        echo 'Attempting direct connection test:' &&
        timeout 5 bash -c '</dev/tcp/orderer.herbionyx.com/7050' 2>/dev/null && echo 'TCP connection successful' || echo 'TCP connection failed'
    "
    exit 1
fi

# Test peer connectivity
echo -e "${YELLOW}3.2. Testing peer connectivity...${NC}"
if docker exec cli timeout 10 nc -z peer0.org1.herbionyx.com 7051 2>/dev/null; then
    echo -e "✅ Peer reachable on port 7051"
elif docker exec cli timeout 10 telnet peer0.org1.herbionyx.com 7051 </dev/null 2>/dev/null | grep -q "Connected"; then
    echo -e "✅ Peer reachable on port 7051 (via telnet)"
else
    echo -e "❌ Cannot reach peer on port 7051"
    exit 1
fi

# Test CouchDB connectivity
echo -e "${YELLOW}3.3. Testing CouchDB connectivity...${NC}"
if docker exec cli timeout 10 nc -z couchdb0 5984 2>/dev/null; then
    echo -e "✅ CouchDB reachable on port 5984"
else
    echo -e "❌ Cannot reach CouchDB on port 5984"
    exit 1
fi

# Test TLS certificates
echo -e "\n${YELLOW}4. Testing TLS certificates...${NC}"

# Check if orderer TLS cert exists
if docker exec cli test -f /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/msp/tlscacerts/tlsca.herbionyx.com-cert.pem; then
    echo -e "✅ Orderer TLS certificate found"
else
    echo -e "❌ Orderer TLS certificate missing"
    exit 1
fi

# Check if peer TLS cert exists
if docker exec cli test -f /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/tls/ca.crt; then
    echo -e "✅ Peer TLS certificate found"
else
    echo -e "❌ Peer TLS certificate missing"
    exit 1
fi

# Test peer CLI commands
echo -e "\n${YELLOW}5. Testing peer CLI commands...${NC}"

# Test peer version
if docker exec cli peer version > /dev/null 2>&1; then
    echo -e "✅ Peer CLI working"
else
    echo -e "❌ Peer CLI not working"
    exit 1
fi

# Test peer list channels (should fail before channel creation, but command should work)
docker exec cli peer channel list > /dev/null 2>&1
if [ $? -eq 0 ] || [ $? -eq 1 ]; then
    echo -e "✅ Peer channel commands working"
else
    echo -e "❌ Peer channel commands not working"
    exit 1
fi

echo -e "\n${GREEN}🎉 All connectivity tests passed!${NC}"
echo -e "${GREEN}Network is ready for channel creation and chaincode deployment.${NC}"