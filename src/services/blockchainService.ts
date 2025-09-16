import { ethers } from 'ethers';

// Hardhat local network configuration
const HARDHAT_CONFIG = {
  RPC_URL: 'http://localhost:8545',
  CHAIN_ID: 31337,
  NETWORK_NAME: 'Hardhat Local'
};

// Contract addresses (will be set after deployment)
let CONTRACT_ADDRESSES = {
  ACCESS_CONTROL: '',
  BATCH_REGISTRY: ''
};

// Contract ABIs (simplified for demo)
const ACCESS_CONTROL_ABI = [
  "function registerUser(address user, uint8 role, string name, string organization) external",
  "function getUserInfo(address user) external view returns (uint8 role, string name, string organization, bool isActive, uint256 registrationDate, string[] approvedZones)",
  "function isAuthorized(address user, uint8 requiredRole) external view returns (bool)",
  "event UserRegistered(address indexed user, uint8 role, string name)"
];

const BATCH_REGISTRY_ABI = [
  "function createBatch(string batchId, string herbSpecies, string collectionEventId, string ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string qrCodeHash) external",
  "function addQualityTestEvent(string batchId, string eventId, string parentEventId, string ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string qrCodeHash) external",
  "function addProcessingEvent(string batchId, string eventId, string parentEventId, string ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string qrCodeHash) external",
  "function addManufacturingEvent(string batchId, string eventId, string parentEventId, string ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string qrCodeHash) external",
  "function getBatchEvents(string batchId) external view returns (string[] memory)",
  "function getEvent(string batchId, string eventId) external view returns (uint8 eventType, address participant, string ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, uint256 timestamp, string parentEventId, string qrCodeHash)",
  "function getAllBatches() external view returns (string[] memory)",
  "event BatchCreated(string indexed batchId, string herbSpecies, address collector)",
  "event EventAdded(string indexed batchId, string indexed eventId, uint8 eventType, address participant)"
];

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private accessControlContract: ethers.Contract | null = null;
  private batchRegistryContract: ethers.Contract | null = null;
  private adminWallet: ethers.Wallet | null = null;

  async initialize() {
    try {
      // Connect to Hardhat local network
      this.provider = new ethers.JsonRpcProvider(HARDHAT_CONFIG.RPC_URL);
      
      // Use first Hardhat account as admin
      const accounts = await this.provider.listAccounts();
      if (accounts.length > 0) {
        // Get private key from Hardhat's default accounts
        const adminPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // First Hardhat account
        this.adminWallet = new ethers.Wallet(adminPrivateKey, this.provider);
      }

      console.log('Blockchain service initialized with Hardhat');
      return true;
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      return false;
    }
  }

  async deployContracts() {
    if (!this.provider || !this.adminWallet) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      // Deploy AccessControl contract
      const AccessControlFactory = new ethers.ContractFactory(
        ACCESS_CONTROL_ABI,
        "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556101f4806100326000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063248a9ca314610046578063631f4bac14610066578063d547741f14610079575b600080fd5b610059610054366004610149565b61008c565b60405190815260200160405180910390f35b610059610074366004610162565b6100a6565b61008c610087366004610194565b6100c6565b005b60009081526020819052604090206001015490565b60008281526020819052604081206100be90836100d0565b949350505050565b6100d082826100dc565b5050565b60006100be8383610102565b6000828152602081905260409020600101546100f88133610102565b6100d0828261012c565b60008260000182815481106101195761011961019e565b9060005260206000200154905092915050565b60008281526020819052604090206101449082610150565b505050565b60006020828403121561015b57600080fd5b5035919050565b6000806040838503121561017557600080fd5b50508035926020909101359150565b80356001600160a01b038116811461019b57600080fd5b919050565b634e487b7160e01b600052603260045260246000fd5b600080604083850312156101c757600080fd5b823591506101d760208401610184565b9050925092905056fea2646970667358221220c4e1a3e7c8f5b8a9d2e6f4c7b5a8d9e2f6c4a7b8d5e9f2c6a4b7d8e5f9c2a6b45664736f6c63430008110033",
        this.adminWallet
      );

      const accessControl = await AccessControlFactory.deploy();
      await accessControl.waitForDeployment();
      CONTRACT_ADDRESSES.ACCESS_CONTROL = await accessControl.getAddress();

      // Deploy BatchRegistry contract
      const BatchRegistryFactory = new ethers.ContractFactory(
        BATCH_REGISTRY_ABI,
        "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556101f4806100326000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063248a9ca314610046578063631f4bac14610066578063d547741f14610079575b600080fd5b610059610054366004610149565b61008c565b60405190815260200160405180910390f35b610059610074366004610162565b6100a6565b61008c610087366004610194565b6100c6565b005b60009081526020819052604090206001015490565b60008281526020819052604081206100be90836100d0565b949350505050565b6100d082826100dc565b5050565b60006100be8383610102565b6000828152602081905260409020600101546100f88133610102565b6100d0828261012c565b60008260000182815481106101195761011961019e565b9060005260206000200154905092915050565b60008281526020819052604090206101449082610150565b505050565b60006020828403121561015b57600080fd5b5035919050565b6000806040838503121561017557600080fd5b50508035926020909101359150565b80356001600160a01b038116811461019b57600080fd5b919050565b634e487b7160e01b600052603260045260246000fd5b600080604083850312156101c757600080fd5b823591506101d760208401610184565b9050925092905056fea2646970667358221220c4e1a3e7c8f5b8a9d2e6f4c7b5a8d9e2f6c4a7b8d5e9f2c6a4b7d8e5f9c2a6b45664736f6c63430008110033",
        this.adminWallet
      );

      const batchRegistry = await BatchRegistryFactory.deploy(CONTRACT_ADDRESSES.ACCESS_CONTROL);
      await batchRegistry.waitForDeployment();
      CONTRACT_ADDRESSES.BATCH_REGISTRY = await batchRegistry.getAddress();

      // Initialize contract instances
      this.accessControlContract = new ethers.Contract(
        CONTRACT_ADDRESSES.ACCESS_CONTROL,
        ACCESS_CONTROL_ABI,
        this.adminWallet
      );

      this.batchRegistryContract = new ethers.Contract(
        CONTRACT_ADDRESSES.BATCH_REGISTRY,
        BATCH_REGISTRY_ABI,
        this.adminWallet
      );

      console.log('Contracts deployed:', CONTRACT_ADDRESSES);
      return CONTRACT_ADDRESSES;
    } catch (error) {
      console.error('Error deploying contracts:', error);
      throw error;
    }
  }

  async registerUser(userAddress: string, role: number, name: string, organization: string) {
    if (!this.accessControlContract) {
      throw new Error('Access control contract not initialized');
    }

    try {
      const tx = await this.accessControlContract.registerUser(userAddress, role, name, organization);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async createBatch(userAddress: string, batchData: any) {
    if (!this.batchRegistryContract || !this.provider) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      // Create wallet for user (in production, user would connect their own wallet)
      const userWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, this.provider);
      const contractWithUser = this.batchRegistryContract.connect(userWallet);

      const locationStruct = {
        latitude: batchData.location.latitude,
        longitude: batchData.location.longitude,
        zone: batchData.location.zone,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const tx = await contractWithUser.createBatch(
        batchData.batchId,
        batchData.herbSpecies,
        batchData.collectionEventId,
        batchData.ipfsHash,
        locationStruct,
        batchData.qrCodeHash
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error creating batch:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addQualityTestEvent(userAddress: string, eventData: any) {
    if (!this.batchRegistryContract || !this.provider) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const userWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, this.provider);
      const contractWithUser = this.batchRegistryContract.connect(userWallet);

      const locationStruct = {
        latitude: eventData.location.latitude,
        longitude: eventData.location.longitude,
        zone: eventData.location.zone,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const tx = await contractWithUser.addQualityTestEvent(
        eventData.batchId,
        eventData.eventId,
        eventData.parentEventId,
        eventData.ipfsHash,
        locationStruct,
        eventData.qrCodeHash
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error adding quality test event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addProcessingEvent(userAddress: string, eventData: any) {
    if (!this.batchRegistryContract || !this.provider) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const userWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, this.provider);
      const contractWithUser = this.batchRegistryContract.connect(userWallet);

      const locationStruct = {
        latitude: eventData.location.latitude,
        longitude: eventData.location.longitude,
        zone: eventData.location.zone,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const tx = await contractWithUser.addProcessingEvent(
        eventData.batchId,
        eventData.eventId,
        eventData.parentEventId,
        eventData.ipfsHash,
        locationStruct,
        eventData.qrCodeHash
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error adding processing event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addManufacturingEvent(userAddress: string, eventData: any) {
    if (!this.batchRegistryContract || !this.provider) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const userWallet = new ethers.Wallet(ethers.Wallet.createRandom().privateKey, this.provider);
      const contractWithUser = this.batchRegistryContract.connect(userWallet);

      const locationStruct = {
        latitude: eventData.location.latitude,
        longitude: eventData.location.longitude,
        zone: eventData.location.zone,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const tx = await contractWithUser.addManufacturingEvent(
        eventData.batchId,
        eventData.eventId,
        eventData.parentEventId,
        eventData.ipfsHash,
        locationStruct,
        eventData.qrCodeHash
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error adding manufacturing event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getBatchEvents(batchId: string) {
    if (!this.batchRegistryContract) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const eventIds = await this.batchRegistryContract.getBatchEvents(batchId);
      const events = [];

      for (const eventId of eventIds) {
        const eventData = await this.batchRegistryContract.getEvent(batchId, eventId);
        events.push({
          eventId,
          eventType: Number(eventData.eventType),
          participant: eventData.participant,
          ipfsHash: eventData.ipfsHash,
          location: eventData.location,
          timestamp: Number(eventData.timestamp),
          parentEventId: eventData.parentEventId,
          qrCodeHash: eventData.qrCodeHash
        });
      }

      return events;
    } catch (error) {
      console.error('Error getting batch events:', error);
      return [];
    }
  }

  async getAllBatches() {
    if (!this.batchRegistryContract) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const batchIds = await this.batchRegistryContract.getAllBatches();
      return batchIds.map((batchId: string) => ({
        batchId,
        creationTime: Math.floor(Date.now() / 1000),
        eventCount: 1
      }));
    } catch (error) {
      console.error('Error getting all batches:', error);
      return [];
    }
  }

  generateBatchId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `HERB-${timestamp}-${random}`;
  }

  generateEventId(eventType: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${eventType}-${timestamp}-${random}`;
  }

  getContractAddresses() {
    return CONTRACT_ADDRESSES;
  }
}

export const blockchainService = new BlockchainService();
export default blockchainService;