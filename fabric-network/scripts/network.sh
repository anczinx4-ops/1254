#!/bin/bash

# HerbionYX Fabric Network Management Script

CHANNEL_NAME="herbionyx-channel"
CHAINCODE_NAME="herbionyx-chaincode"
CHAINCODE_VERSION="1.0"
CHAINCODE_SEQUENCE="1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function printHelp() {
  echo "Usage: "
  echo "  network.sh <Mode> [Flags]"
  echo "    <Mode>"
  echo "      - 'up' - Bring up the network"
  echo "      - 'down' - Clear the network"
  echo "      - 'restart' - Restart the network"
  echo "      - 'deployCC' - Deploy chaincode"
  echo "      - 'createChannel' - Create channel"
  echo
  echo "    Flags:"
  echo "    -c <channel name> - Channel name to use (default: \"herbionyx-channel\")"
  echo "    -ccn <name> - Chaincode name (default: \"herbionyx-chaincode\")"
  echo "    -ccv <version> - Chaincode version (default: \"1.0\")"
  echo
  echo " Examples:"
  echo "   network.sh up"
  echo "   network.sh down"
  echo "   network.sh deployCC"
}

function networkUp() {
  echo -e "${GREEN}Starting HerbionYX Fabric Network...${NC}"
  
  # Generate crypto material
  echo -e "${YELLOW}Generating certificates...${NC}"
  ./generate-certs.sh
  
  # Start the network
  echo -e "${YELLOW}Starting Docker containers...${NC}"
  docker-compose up -d
  
  # Wait for containers to start
  echo -e "${YELLOW}Waiting for containers to start...${NC}"
  sleep 10
  
  echo -e "${GREEN}✅ Network started successfully!${NC}"
}

function networkDown() {
  echo -e "${RED}Stopping HerbionYX Fabric Network...${NC}"
  
  # Stop containers
  docker-compose down --volumes --remove-orphans
  
  # Remove chaincode images
  docker rmi $(docker images | grep herbionyx-chaincode | awk '{print $3}') 2>/dev/null || true
  
  # Clean up
  docker system prune -f
  
  echo -e "${GREEN}✅ Network stopped and cleaned up!${NC}"
}

function createChannel() {
  echo -e "${GREEN}Creating channel: ${CHANNEL_NAME}${NC}"
  
  # Set environment for peer0.org1
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID="Org1MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=${PWD}/../organizations/peerOrganizations/org1.herbionyx.com/users/Admin@org1.herbionyx.com/msp
  export CORE_PEER_ADDRESS=localhost:7051
  
  # Create channel
  peer channel create -o localhost:7050 -c $CHANNEL_NAME --ordererTLSHostnameOverride orderer.herbionyx.com -f ../channel-artifacts/${CHANNEL_NAME}.tx --outputBlock ../channel-artifacts/${CHANNEL_NAME}.block --tls --cafile ${PWD}/../organizations/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/msp/tlscacerts/tlsca.herbionyx.com-cert.pem
  
  # Join channel
  peer channel join -b ../channel-artifacts/${CHANNEL_NAME}.block
  
  echo -e "${GREEN}✅ Channel created and joined successfully!${NC}"
}

function deployChaincode() {
  echo -e "${GREEN}Deploying chaincode: ${CHAINCODE_NAME}${NC}"
  
  # Set environment
  export CORE_PEER_TLS_ENABLED=true
  export CORE_PEER_LOCALMSPID="Org1MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/tls/ca.crt
  export CORE_PEER_MSPCONFIGPATH=${PWD}/../organizations/peerOrganizations/org1.herbionyx.com/users/Admin@org1.herbionyx.com/msp
  export CORE_PEER_ADDRESS=localhost:7051
  
  # Package chaincode
  echo -e "${YELLOW}Packaging chaincode...${NC}"
  peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz --path ../chaincode --lang node --label ${CHAINCODE_NAME}_${CHAINCODE_VERSION}
  
  # Install chaincode
  echo -e "${YELLOW}Installing chaincode...${NC}"
  peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz
  
  # Get package ID
  PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
  echo "Package ID: $PACKAGE_ID"
  
  # Approve chaincode
  echo -e "${YELLOW}Approving chaincode...${NC}"
  peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.herbionyx.com --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $PACKAGE_ID --sequence $CHAINCODE_SEQUENCE --tls --cafile ${PWD}/../organizations/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/msp/tlscacerts/tlsca.herbionyx.com-cert.pem
  
  # Commit chaincode
  echo -e "${YELLOW}Committing chaincode...${NC}"
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.herbionyx.com --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --sequence $CHAINCODE_SEQUENCE --tls --cafile ${PWD}/../organizations/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/msp/tlscacerts/tlsca.herbionyx.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/tls/ca.crt
  
  echo -e "${GREEN}✅ Chaincode deployed successfully!${NC}"
}

# Parse command line arguments
if [[ $# -lt 1 ]] ; then
  printHelp
  exit 0
else
  MODE=$1
  shift
fi

# Parse flags
while [[ $# -ge 1 ]] ; do
  key="$1"
  case $key in
  -c )
    CHANNEL_NAME="$2"
    shift
    ;;
  -ccn )
    CHAINCODE_NAME="$2"
    shift
    ;;
  -ccv )
    CHAINCODE_VERSION="$2"
    shift
    ;;
  * )
    echo "Unknown flag: $key"
    printHelp
    exit 1
    ;;
  esac
  shift
done

# Execute based on mode
case $MODE in
  up )
    networkUp
    ;;
  down )
    networkDown
    ;;
  restart )
    networkDown
    sleep 2
    networkUp
    ;;
  createChannel )
    createChannel
    ;;
  deployCC )
    deployChaincode
    ;;
  * )
    printHelp
    exit 1
esac