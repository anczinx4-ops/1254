# HerbionYX Hyperledger Fabric Setup Instructions

## Quick Setup (Recommended)

Run the complete setup script that handles everything automatically:

```bash
cd fabric-network/scripts
./complete-setup.sh
```

This script will:
1. Setup Docker (with WSL2 support)
2. Fix chaincode dependencies
3. Generate certificates
4. Start the Fabric network
5. Create the channel
6. Deploy the chaincode

## Manual Setup (Step by Step)

If you prefer to run each step manually:

### 1. Setup Docker
```bash
cd fabric-network/scripts
./setup-docker.sh
```

### 2. Fix Chaincode
```bash
./fix-chaincode.sh
```

### 3. Start Network
```bash
./network.sh up
```

### 4. Create Channel
```bash
./network.sh createChannel
```

### 5. Deploy Chaincode
```bash
./network.sh deployCC
```

## Troubleshooting

### Docker Issues on WSL2
If you get Docker socket errors:
1. Make sure Docker Desktop is running on Windows
2. Enable WSL2 integration in Docker Desktop settings
3. Run: `sudo chmod 666 /var/run/docker.sock`

### Channel Creation Issues
The configtx.yaml has been updated to include proper Consortium configuration. If you still get errors:
1. Check that certificates are generated: `ls -la fabric-network/organizations/`
2. Verify genesis block exists: `ls -la fabric-network/channel-artifacts/`

### Chaincode Installation Issues
The Docker configuration has been updated to properly mount the Docker socket. If chaincode installation fails:
1. Ensure Docker is running and accessible
2. Check that chaincode dependencies are installed: `cd fabric-network/chaincode && npm install`
3. Verify the peer container has access to Docker: `docker exec peer0.org1.herbionyx.com docker ps`

## Verification

After successful setup, verify the network:

```bash
# Check containers are running
docker ps

# Check channel list
docker exec cli peer channel list

# Test chaincode
docker exec cli peer chaincode query -C herbionyx-channel -n herbionyx-chaincode -c '{"Args":["getAllBatches"]}'
```

## Starting the Application

After the Fabric network is running:

1. **Start Backend Server:**
   ```bash
   cd server
   npm install
   npm run dev
   ```

2. **Start Frontend (new terminal):**
   ```bash
   npm install
   npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - CouchDB: http://localhost:5984/_utils

## Network Information

- **Channel:** herbionyx-channel
- **Chaincode:** herbionyx-chaincode
- **Orderer:** orderer.herbionyx.com:7050
- **Peer:** peer0.org1.herbionyx.com:7051
- **CouchDB:** localhost:5984
- **Organization:** Org1MSP

## Demo Credentials

Use these credentials to test the application:
- **Collector:** collector@demo.com / demo123
- **Tester:** tester@demo.com / demo123
- **Processor:** processor@demo.com / demo123
- **Manufacturer:** manufacturer@demo.com / demo123
- **Admin:** admin@demo.com / demo123
- **Consumer:** consumer@demo.com / demo123