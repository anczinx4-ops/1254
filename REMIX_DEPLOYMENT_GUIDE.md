# HerbionYX Remix Deployment Guide

## Step 1: Prepare Contracts for Remix

1. **Open Remix IDE**: Go to https://remix.ethereum.org/

2. **Create New Workspace**: 
   - Click "Create" → "Blank"
   - Name it "HerbionYX"

3. **Upload Contracts**:
   - Create folder: `contracts`
   - Upload these files:
     - `HerbionYXAccessControl.sol`
     - `HerbionYXBatchRegistry.sol`

## Step 2: Compile Contracts

1. **Go to Solidity Compiler Tab** (left sidebar)
2. **Set Compiler Version**: 0.8.19
3. **Enable Optimization**: Check "Enable optimization" (200 runs)
4. **Compile**: Click "Compile HerbionYXAccessControl.sol" and "Compile HerbionYXBatchRegistry.sol"

## Step 3: Setup Polygon Mumbai Network

### Option A: Using MetaMask
1. **Add Polygon Mumbai to MetaMask**:
   - Network Name: `Polygon Mumbai`
   - RPC URL: `https://rpc-mumbai.maticvigil.com/`
   - Chain ID: `80001`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://mumbai.polygonscan.com`

2. **Get Test MATIC**:
   - Go to https://faucet.polygon.technology/
   - Enter your wallet address
   - Request MATIC tokens

### Option B: Using Remix VM (for testing)
- Select "Remix VM (London)" for local testing

## Step 4: Deploy Contracts

### Deploy AccessControl Contract First:

1. **Go to Deploy & Run Tab**
2. **Select Environment**: 
   - "Injected Provider - MetaMask" (for Polygon Mumbai)
   - OR "Remix VM (London)" (for testing)
3. **Select Contract**: `HerbionYXAccessControl`
4. **Deploy**: Click "Deploy"
5. **Copy Contract Address**: Save the deployed address

### Deploy BatchRegistry Contract:

1. **Select Contract**: `HerbionYXBatchRegistry`
2. **Constructor Parameter**: Paste the AccessControl contract address
3. **Deploy**: Click "Deploy"
4. **Copy Contract Address**: Save the deployed address

## Step 5: Update Frontend Configuration

Create/Update `src/config/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  ACCESS_CONTROL: "0xYourAccessControlAddress", // Paste here
  BATCH_REGISTRY: "0xYourBatchRegistryAddress", // Paste here
};

export const NETWORK_CONFIG = {
  chainId: 80001, // Polygon Mumbai
  name: "Polygon Mumbai",
  rpcUrl: "https://rpc-mumbai.maticvigil.com/",
  blockExplorer: "https://mumbai.polygonscan.com",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  }
};
```

## Step 6: Register Demo Users

After deployment, register demo users using Remix:

1. **Go to AccessControl contract**
2. **Call `registerUser` function** for each demo user:

```solidity
// Collector
registerUser("0x627306090abab3a6e1400e9345bc60c78a8bef57", 1, "John Collector", "Himalayan Herbs Co.")

// Tester  
registerUser("0xf17f52151ebef6c7334fad080c5704d77216b732", 2, "Sarah Tester", "Quality Labs Inc.")

// Processor
registerUser("0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef", 3, "Mike Processor", "Herbal Processing Ltd.")

// Manufacturer
registerUser("0x821aea9a577a9b44299b9c15c88cf3087f3b5544", 4, "Lisa Manufacturer", "Ayurvedic Products Inc.")
```

## Step 7: Test Contract Functions

### Test AccessControl:
- `getUserInfo(address)` - Get user details
- `isAuthorized(address, role)` - Check permissions
- `getTotalUsers()` - Get total registered users

### Test BatchRegistry:
- `createBatch(...)` - Create new batch (as collector)
- `getBatchInfo(batchId)` - Get batch details
- `getAllBatches()` - Get all batch IDs

## Step 8: Frontend Integration

Update your frontend service to use the deployed contracts:

```typescript
// src/services/blockchainService.ts
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from '../config/contracts';

const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);

// Contract ABIs (copy from Remix compilation artifacts)
const ACCESS_CONTROL_ABI = [...]; // Copy from Remix
const BATCH_REGISTRY_ABI = [...]; // Copy from Remix

// Initialize contracts
const accessControlContract = new ethers.Contract(
  CONTRACT_ADDRESSES.ACCESS_CONTROL,
  ACCESS_CONTROL_ABI,
  provider
);

const batchRegistryContract = new ethers.Contract(
  CONTRACT_ADDRESSES.BATCH_REGISTRY,
  BATCH_REGISTRY_ABI,
  provider
);
```

## Step 9: Verify Deployment

1. **Check on Block Explorer**:
   - Go to https://mumbai.polygonscan.com
   - Search for your contract addresses
   - Verify transactions

2. **Test Frontend**:
   - Login with demo credentials
   - Create a batch
   - Verify on blockchain explorer

## Troubleshooting

### Common Issues:

1. **Gas Estimation Failed**: Increase gas limit in MetaMask
2. **Transaction Reverted**: Check user permissions and input validation
3. **Contract Not Found**: Verify contract addresses are correct
4. **Network Issues**: Ensure you're connected to Polygon Mumbai

### Gas Optimization:

- Use `view` functions for reading data (no gas cost)
- Batch multiple operations when possible
- Consider using events for off-chain data indexing

## Production Deployment

For mainnet deployment:
1. Use Polygon Mainnet instead of Mumbai
2. Get real MATIC tokens
3. Consider using a multisig wallet for admin functions
4. Implement proper access controls
5. Add contract verification on PolygonScan

## Security Considerations

1. **Admin Key Management**: Use hardware wallet for admin account
2. **Role Validation**: Always verify user roles before operations
3. **Input Validation**: Contracts include comprehensive input checks
4. **Upgrade Strategy**: Consider using proxy patterns for upgradability
5. **Audit**: Get contracts audited before mainnet deployment

---

**Next Steps**: After successful deployment, update the frontend configuration and test the complete flow from collection to manufacturing.