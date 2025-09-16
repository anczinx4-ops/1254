#!/bin/bash

# Generate certificates for HerbionYX Fabric Network

set -e

# Create organizations directory structure
mkdir -p ../organizations/ordererOrganizations/herbionyx.com/orderers/orderer.herbionyx.com/{msp,tls}
mkdir -p ../organizations/peerOrganizations/org1.herbionyx.com/peers/peer0.org1.herbionyx.com/{msp,tls}
mkdir -p ../organizations/peerOrganizations/org1.herbionyx.com/users/Admin@org1.herbionyx.com/msp
mkdir -p ../organizations/fabric-ca/org1

echo "Generating crypto material using cryptogen..."

# Create cryptogen config
cat > ../organizations/crypto-config.yaml << EOF
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
cryptogen generate --config=../organizations/crypto-config.yaml --output="../organizations"

echo "✅ Certificates generated successfully!"