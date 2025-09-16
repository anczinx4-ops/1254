# HerbionYX Real Blockchain Deployment Guide

## Overview
This system uses **real blockchain** (Polygon Mumbai) with **real IPFS** uploads, but eliminates wallet popups and gas costs for users through server-managed wallets.

## Architecture
- **Frontend**: React app with no wallet integration
- **Backend**: Node.js server managing all blockchain transactions
- **Blockchain**: Polygon Mumbai testnet (free transactions)
- **Storage**: Real IPFS via Pinata
- **Wallets**: Server-managed enterprise wallets

## Step 1: Get Free MATIC Tokens

1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Request MATIC tokens for these addresses:
   - `0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1` (Master wallet)
   - `0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0` (Collector)
   - `0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b` (Tester)
   - `0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d` (Processor)
   - `0xd03ea8624C8C5987235048901fB614fDcA89b117` (Manufacturer)

## Step 2: Deploy Smart Contracts

### Option A: Using Remix IDE (Recommended)
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create new files and paste the contract code:
   - `SimpleAccessControl.sol`
   - `SimpleBatchRegistry.sol`
3. Compile with Solidity 0.8.19
4. Deploy to Polygon Mumbai:
   - Network: Polygon Mumbai
   - RPC URL: `https://rpc-mumbai.maticvigil.com/`
   - Chain ID: 80001
5. Copy deployed contract addresses

### Option B: Using Hardhat
```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Configure hardhat.config.js for Polygon Mumbai
# Deploy contracts
npx hardhat run scripts/deploy.js --network mumbai
```

## Step 3: Setup IPFS (Pinata)

1. Sign up at [Pinata](https://pinata.cloud/) (free tier)
2. Get API credentials:
   - API Key
   - Secret API Key
3. Add to `.env` file

## Step 4: Configure Environment

Create `.env` file in server directory:
```bash
# Copy from .env.example and update:
ACCESS_CONTROL_ADDRESS=0xYourAccessControlAddress
BATCH_REGISTRY_ADDRESS=0xYourBatchRegistryAddress
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

## Step 5: Start the System

```bash
# Install dependencies
npm install
cd server && npm install

# Start backend
cd server && npm run dev

# Start frontend (new terminal)
npm run dev
```

## Step 6: Verify Real Blockchain Integration

1. Create a batch in the app
2. Check transaction on [Mumbai PolygonScan](https://mumbai.polygonscan.com/)
3. Verify IPFS upload on Pinata dashboard
4. Confirm QR codes contain real hashes

## Key Features

✅ **Real Blockchain**: All transactions on Polygon Mumbai  
✅ **Real IPFS**: Actual file uploads to Pinata  
✅ **Real Hashes**: Cryptographic hashes for all data  
✅ **No Wallet Popups**: Server manages all wallets  
✅ **No Gas Costs**: Enterprise pays all fees  
✅ **Permissioned**: Role-based access control  
✅ **Enterprise Ready**: Production-grade architecture  

## Security Notes

- Private keys are server-managed (secure in production)
- All transactions are signed server-side
- Users never interact with wallets directly
- Role-based permissions enforced on blockchain
- IPFS provides tamper-proof storage

## Production Deployment

For production:
1. Use mainnet or private blockchain
2. Implement proper key management (HSM/KMS)
3. Add monitoring and alerting
4. Scale with load balancers
5. Implement backup strategies

## Support

The system provides:
- Real blockchain transactions with explorer links
- Real IPFS hashes and URLs
- Complete audit trail
- Enterprise-grade security
- Zero user friction (no wallets needed)