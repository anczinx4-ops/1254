#!/bin/bash

# Generate certificates for HerbionYX Fabric Network

set -e

# Set Fabric configuration path
export FABRIC_CFG_PATH=${PWD}/../config
export FABRIC_LOGGING_SPEC=INFO

# Create organizations directory structure
echo "Creating directory structure..."
mkdir -p ../organizations/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/{msp,tls}
mkdir -p ../organizations/ordererOrganizations/herbionyx.com/msp/{admincerts,cacerts,tlscacerts}
mkdir -p ../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/{msp,tls}
mkdir -p ../organizations/peerOrganizations/org1.herbionyx.com/msp/{admincerts,cacerts,tlscacerts}
mkdir -p ../organizations/peerOrganizations/org1.herbionyx.com/users/Admin@org1.herbionyx.com/msp
mkdir -p ../organizations/fabric-ca/org1
mkdir -p ../channel-artifacts

echo "Generating crypto material using cryptogen..."

# Create cryptogen config
cat > ../config/crypto-config.yaml << EOF
OrdererOrgs:
  - Name: Orderer
    Domain: herbionyx.com
    Specs:
      - Hostname: orderer
        SANS:
          - localhost
          - orderer.herbionyx.com
    CA:
      Country: US
      Province: California
      Locality: San Francisco
      OrganizationalUnit: Hyperledger Fabric
      StreetAddress: address for org # default nil
      PostalCode: postalCode for org # default nil

PeerOrgs:
  - Name: Org1
    Domain: org1.herbionyx.com
    EnableNodeOUs: true
    Template:
      Count: 1
      SANS:
        - localhost
        - peer0.org1.herbionyx.com
    Users:
      Count: 1
    CA:
      Country: US
      Province: California
      Locality: San Francisco
      OrganizationalUnit: Hyperledger Fabric
      StreetAddress: address for org1 # default nil
      PostalCode: postalCode for org1 # default nil
EOF

# Generate certificates
if ! command -v cryptogen &> /dev/null; then
    echo "cryptogen not found. Please install Hyperledger Fabric binaries."
    exit 1
fi

cryptogen generate --config=../config/crypto-config.yaml --output="../organizations"

if [ $? -ne 0 ]; then
    echo "Failed to generate certificates"
    exit 1
fi

# Fix MSP directory structure for peer
echo "Setting up MSP directory structure..."

# Copy certificates to correct locations for peer
PEER_MSP_DIR="../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/msp"
mkdir -p ${PEER_MSP_DIR}/{signcerts,keystore,cacerts,tlscacerts,admincerts}

# Copy signing certificate
if [ -f "../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/msp/signcerts/peer0.org1.herbionyx.com-cert.pem" ]; then
    echo "Peer signing certificate already exists"
else
    # Find and copy the peer certificate
    find ../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com -name "*.pem" -path "*/signcerts/*" -exec cp {} ${PEER_MSP_DIR}/signcerts/ \;
fi

# Copy CA certificates
cp ../organizations/peerOrganizations/org1.herbionyx.com/ca/ca.org1.herbionyx.com-cert.pem ${PEER_MSP_DIR}/cacerts/
cp ../organizations/peerOrganizations/org1.herbionyx.com/tlsca/tlsca.org1.herbionyx.com-cert.pem ${PEER_MSP_DIR}/tlscacerts/

# Copy admin certificates
cp ../organizations/peerOrganizations/org1.herbionyx.com/users/Admin@org1.herbionyx.com/msp/signcerts/Admin@org1.herbionyx.com-cert.pem ${PEER_MSP_DIR}/admincerts/

# Copy private key
find ../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/msp/keystore -name "*_sk" -exec cp {} ${PEER_MSP_DIR}/keystore/ \;

# Fix MSP directory structure for orderer
ORDERER_MSP_DIR="../organizations/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/msp"
mkdir -p ${ORDERER_MSP_DIR}/{signcerts,keystore,cacerts,tlscacerts,admincerts}

# Copy orderer certificates
cp ../organizations/ordererOrganizations/herbionyx.com/ca/ca.herbionyx.com-cert.pem ${ORDERER_MSP_DIR}/cacerts/
cp ../organizations/ordererOrganizations/herbionyx.com/tlsca/tlsca.herbionyx.com-cert.pem ${ORDERER_MSP_DIR}/tlscacerts/

# Copy orderer signing certificate and private key
find ../organizations/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/msp/keystore -name "*_sk" -exec cp {} ${ORDERER_MSP_DIR}/keystore/ \;

# Copy admin certificates for orderer
cp ../organizations/ordererOrganizations/herbionyx.com/users/Admin@herbionyx.com/msp/signcerts/Admin@herbionyx.com-cert.pem ${ORDERER_MSP_DIR}/admincerts/

# Set proper permissions
echo "Setting permissions..."
chmod -R 755 ../organizations/

echo "✅ Certificates generated successfully!"
echo "Directory structure:"
find ../organizations -type d | head -20