// Contract configuration for HerbionYX
// Update these addresses after deploying contracts via Remix

export const CONTRACT_ADDRESSES = {
  ACCESS_CONTROL: "", // Paste HerbionYXAccessControl contract address here
  BATCH_REGISTRY: "", // Paste HerbionYXBatchRegistry contract address here
};

export const NETWORK_CONFIG = {
  chainId: 80001, // Polygon Mumbai Testnet
  name: "Polygon Mumbai",
  rpcUrl: "https://rpc-mumbai.maticvigil.com/",
  blockExplorer: "https://mumbai.polygonscan.com",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18
  }
};

// Contract ABIs - Update these after compilation in Remix
export const ACCESS_CONTROL_ABI = [
  "function registerUser(address user, uint8 role, string memory name, string memory organization) external",
  "function getUserInfo(address user) external view returns (uint8 role, string memory name, string memory organization, bool isActive, uint256 registrationDate)",
  "function isAuthorized(address user, uint8 requiredRole) external view returns (bool)",
  "function deactivateUser(address user) external",
  "function reactivateUser(address user) external",
  "function getRoleMembers(uint8 role) external view returns (address[] memory)",
  "function getTotalUsers() external view returns (uint256)",
  "function isRegistered(address user) external view returns (bool)",
  "event UserRegistered(address indexed user, uint8 role, string name, string organization)",
  "event UserDeactivated(address indexed user)",
  "event UserReactivated(address indexed user)"
];

export const BATCH_REGISTRY_ABI = [
  "function createBatch(string memory batchId, string memory herbSpecies, string memory collectionEventId, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string memory qrCodeHash) external",
  "function addQualityTestEvent(string memory batchId, string memory eventId, string memory parentEventId, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string memory qrCodeHash) external",
  "function addProcessingEvent(string memory batchId, string memory eventId, string memory parentEventId, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string memory qrCodeHash) external",
  "function addManufacturingEvent(string memory batchId, string memory eventId, string memory parentEventId, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string memory qrCodeHash) external",
  "function getBatchEvents(string memory batchId) external view returns (string[] memory)",
  "function getEvent(string memory batchId, string memory eventId) external view returns (uint8 eventType, address participant, string memory participantName, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, uint256 timestamp, string memory parentEventId, string memory qrCodeHash)",
  "function getAllBatches() external view returns (string[] memory)",
  "function getBatchInfo(string memory batchId) external view returns (string memory herbSpecies, address creator, uint256 creationTime, uint256 lastUpdated, uint256 eventCount)",
  "function getBatchByEventId(string memory eventId) external view returns (string memory)",
  "function getPlatformStats() external view returns (uint256 totalBatches, uint256 totalEvents, uint256 totalUsers)",
  "function doesEventExist(string memory eventId) external view returns (bool)",
  "event BatchCreated(string indexed batchId, string herbSpecies, address indexed creator, string creatorName, uint256 timestamp)",
  "event EventAdded(string indexed batchId, string indexed eventId, uint8 eventType, address indexed participant, string participantName, uint256 timestamp)",
  "event QRCodeGenerated(string indexed eventId, string qrCodeHash)"
];

// Demo user addresses for testing
export const DEMO_USERS = {
  COLLECTOR: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
  TESTER: "0xf17f52151ebef6c7334fad080c5704d77216b732", 
  PROCESSOR: "0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef",
  MANUFACTURER: "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
  ADMIN: "0x627306090abab3a6e1400e9345bc60c78a8bef57"
};

// Role mappings
export const ROLES = {
  NONE: 0,
  COLLECTOR: 1,
  TESTER: 2,
  PROCESSOR: 3,
  MANUFACTURER: 4,
  ADMIN: 5,
  CONSUMER: 6
};