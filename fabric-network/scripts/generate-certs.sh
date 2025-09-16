#!/bin/bash

# Generate certificates for HerbionYX Fabric Network

set -e

# Set Fabric configuration path
export FABRIC_CFG_PATH=${PWD}/../config
export FABRIC_LOGGING_SPEC=INFO

# Create organizations directory structure
echo "Creating directory structure..."
mkdir -p ../organizations/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/{msp,tls}
mkdir -p ../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/{msp,tls}
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

# Copy TLS CA certificates to the correct locations
echo "Setting up TLS CA certificates..."
mkdir -p ../organizations/ordererOrganizations/herbionyx.com/msp/tlscacerts
mkdir -p ../organizations/peerOrganizations/org1.herbionyx.com/msp/tlscacerts

# Check if certificates exist and copy them
if [ -f "../organizations/ordererOrganizations/herbionyx.com/tlsca/tlsca.herbionyx.com-cert.pem" ]; then
    cp ../organizations/ordererOrganizations/herbionyx.com/tlsca/tlsca.herbionyx.com-cert.pem ../organizations/ordererOrganizations/herbionyx.com/msp/tlscacerts/
else
    echo "Warning: Orderer TLS CA certificate not found"
fi

if [ -f "../organizations/peerOrganizations/org1.herbionyx.com/tlsca/tlsca.org1.herbionyx.com-cert.pem" ]; then
    cp ../organizations/peerOrganizations/org1.herbionyx.com/tlsca/tlsca.org1.herbionyx.com-cert.pem ../organizations/peerOrganizations/org1.herbionyx.com/msp/tlscacerts/
else
    echo "Warning: Peer TLS CA certificate not found"
fi

# Set proper permissions
echo "Setting permissions..."
chmod -R 755 ../organizations/

echo "✅ Certificates generated successfully!"
echo "Directory structure:"
find ../organizations -type d | head -20