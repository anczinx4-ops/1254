#!/bin/bash

# Generate certificates for HerbionYX Fabric Network

set -e

# Set Fabric configuration path
export FABRIC_CFG_PATH=${PWD}/../config

# Create organizations directory structure
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

PeerOrgs:
  - Name: Org1
    Domain: org1.herbionyx.com
    EnableNodeOUs: true
    Template:
      Count: 1
    Users:
      Count: 1
EOF

# Generate certificates
cryptogen generate --config=../config/crypto-config.yaml --output="../organizations"

# Copy TLS CA certificates to the correct locations
mkdir -p ../organizations/ordererOrganizations/herbionyx.com/msp/tlscacerts
mkdir -p ../organizations/peerOrganizations/org1.herbionyx.com/msp/tlscacerts

cp ../organizations/ordererOrganizations/herbionyx.com/tlsca/tlsca.herbionyx.com-cert.pem ../organizations/ordererOrganizations/herbionyx.com/msp/tlscacerts/
cp ../organizations/peerOrganizations/org1.herbionyx.com/tlsca/tlsca.org1.herbionyx.com-cert.pem ../organizations/peerOrganizations/org1.herbionyx.com/msp/tlscacerts/

echo "✅ Certificates generated successfully!"