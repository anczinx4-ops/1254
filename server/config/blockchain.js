const { ethers } = require('ethers');

// Real Polygon Mumbai configuration for enterprise use
const POLYGON_MUMBAI_CONFIG = {
  RPC_URL: 'https://rpc-mumbai.maticvigil.com/',
  CHAIN_ID: 80001,
  NETWORK_NAME: 'Polygon Mumbai',
  BLOCK_EXPLORER: 'https://mumbai.polygonscan.com',
  NATIVE_CURRENCY: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  }
};

// Enterprise wallet configuration - server manages all transactions
const ENTERPRISE_WALLETS = {
  // Main enterprise wallet that pays for all gas
  MASTER: {
    privateKey: process.env.MASTER_PRIVATE_KEY || '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
    address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1'
  },
  // Individual user wallets (server-managed)
  COLLECTOR: {
    privateKey: process.env.COLLECTOR_PRIVATE_KEY || '0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1',
    address: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0'
  },
  TESTER: {
    privateKey: process.env.TESTER_PRIVATE_KEY || '0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c',
    address: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b'
  },
  PROCESSOR: {
    privateKey: process.env.PROCESSOR_PRIVATE_KEY || '0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913',
    address: '0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d'
  },
  MANUFACTURER: {
    privateKey: process.env.MANUFACTURER_PRIVATE_KEY || '0xadd53f9a7e588d003326d1cbf9e4a43c061aadd9bc938c843a79e7b4fd2ad743',
    address: '0xd03ea8624C8C5987235048901fB614fDcA89b117'
  }
};

// Initialize provider
const provider = new ethers.JsonRpcProvider(POLYGON_MUMBAI_CONFIG.RPC_URL);

// Initialize wallets
const masterWallet = new ethers.Wallet(ENTERPRISE_WALLETS.MASTER.privateKey, provider);
const collectorWallet = new ethers.Wallet(ENTERPRISE_WALLETS.COLLECTOR.privateKey, provider);
const testerWallet = new ethers.Wallet(ENTERPRISE_WALLETS.TESTER.privateKey, provider);
const processorWallet = new ethers.Wallet(ENTERPRISE_WALLETS.PROCESSOR.privateKey, provider);
const manufacturerWallet = new ethers.Wallet(ENTERPRISE_WALLETS.MANUFACTURER.privateKey, provider);

// Simplified contract ABIs for reduced gas usage
const ACCESS_CONTROL_ABI = [
  "function registerUser(address user, uint8 role, string memory name, string memory organization) external",
  "function getUserInfo(address user) external view returns (uint8 role, string memory name, string memory organization, bool isActive, uint256 registrationDate)",
  "function isAuthorized(address user, uint8 requiredRole) external view returns (bool)",
  "event UserRegistered(address indexed user, uint8 role, string name)"
];

const BATCH_REGISTRY_ABI = [
  "function createBatch(string memory batchId, string memory herbSpecies, string memory ipfsHash, string memory qrCodeHash) external",
  "function addEvent(string memory batchId, string memory eventId, uint8 eventType, string memory parentEventId, string memory ipfsHash, string memory qrCodeHash) external",
  "function getBatchEvents(string memory batchId) external view returns (string[] memory)",
  "function getEvent(string memory batchId, string memory eventId) external view returns (uint8 eventType, address participant, string memory ipfsHash, uint256 timestamp, string memory parentEventId, string memory qrCodeHash)",
  "function getAllBatches() external view returns (string[] memory)",
  "event BatchCreated(string indexed batchId, string herbSpecies, address collector)",
  "event EventAdded(string indexed batchId, string indexed eventId, uint8 eventType, address participant)"
];

// Contract addresses (deploy these simplified contracts)
const CONTRACT_ADDRESSES = {
  ACCESS_CONTROL: process.env.ACCESS_CONTROL_ADDRESS || '',
  BATCH_REGISTRY: process.env.BATCH_REGISTRY_ADDRESS || ''
};

module.exports = {
  provider,
  masterWallet,
  collectorWallet,
  testerWallet,
  processorWallet,
  manufacturerWallet,
  ACCESS_CONTROL_ABI,
  BATCH_REGISTRY_ABI,
  CONTRACT_ADDRESSES,
  POLYGON_MUMBAI_CONFIG,
  ENTERPRISE_WALLETS
};