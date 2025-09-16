import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, CONTRACT_ADDRESSES, CURRENT_NETWORK } from '../config/blockchain';

// Contract ABIs (simplified for demo)
const ACCESS_CONTROL_ABI = [
  "function registerUser(address user, uint8 role, string memory name, string memory organization) external",
  "function getUserInfo(address user) external view returns (uint8 role, string memory name, string memory organization, bool isActive, uint256 registrationDate, string[] memory approvedZones)",
  "function isAuthorized(address user, uint8 requiredRole) external view returns (bool)",
  "event UserRegistered(address indexed user, uint8 role, string name)"
];

const BATCH_REGISTRY_ABI = [
  "function createBatch(string memory batchId, string memory herbSpecies, string memory collectionEventId, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string memory qrCodeHash) external",
  "function addQualityTestEvent(string memory batchId, string memory eventId, string memory parentEventId, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string memory qrCodeHash) external",
  "function addProcessingEvent(string memory batchId, string memory eventId, string memory parentEventId, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string memory qrCodeHash) external",
  "function addManufacturingEvent(string memory batchId, string memory eventId, string memory parentEventId, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, string memory qrCodeHash) external",
  "function getBatchEvents(string memory batchId) external view returns (string[] memory)",
  "function getEvent(string memory batchId, string memory eventId) external view returns (uint8 eventType, address participant, string memory ipfsHash, tuple(string latitude, string longitude, string zone, uint256 timestamp) location, uint256 timestamp, string memory parentEventId, string memory qrCodeHash)",
  "function getAllBatches() external view returns (string[] memory)",
  "event BatchCreated(string indexed batchId, string herbSpecies, address collector)",
  "event EventAdded(string indexed batchId, string indexed eventId, uint8 eventType, address participant)"
];

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private accessControlContract: ethers.Contract | null = null;
  private batchRegistryContract: ethers.Contract | null = null;

  async initialize() {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.signer = await this.provider.getSigner();
      
      // Check if we're on the correct network
      const network = await this.provider.getNetwork();
      if (Number(network.chainId) !== CURRENT_NETWORK.chainId) {
        await this.switchNetwork();
      }

      // Initialize contracts
      if (CONTRACT_ADDRESSES.ACCESS_CONTROL && CONTRACT_ADDRESSES.BATCH_REGISTRY) {
        this.accessControlContract = new ethers.Contract(
          CONTRACT_ADDRESSES.ACCESS_CONTROL,
          ACCESS_CONTROL_ABI,
          this.signer
        );

        this.batchRegistryContract = new ethers.Contract(
          CONTRACT_ADDRESSES.BATCH_REGISTRY,
          BATCH_REGISTRY_ABI,
          this.signer
        );
      }

      return true;
    } catch (error) {
      console.error('Error initializing Web3:', error);
      throw error;
    }
  }

  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CURRENT_NETWORK.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${CURRENT_NETWORK.chainId.toString(16)}`,
              chainName: CURRENT_NETWORK.name,
              rpcUrls: [CURRENT_NETWORK.rpcUrl],
              nativeCurrency: CURRENT_NETWORK.nativeCurrency,
              blockExplorerUrls: [CURRENT_NETWORK.blockExplorer],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }

  async getCurrentAccount(): Promise<string> {
    if (!this.signer) {
      throw new Error('Web3 not initialized');
    }
    return await this.signer.getAddress();
  }

  async createBatch(batchData: any) {
    if (!this.batchRegistryContract) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const tx = await this.batchRegistryContract.createBatch(
        batchData.batchId,
        batchData.herbSpecies,
        batchData.collectionEventId,
        batchData.ipfsHash,
        {
          latitude: batchData.location.latitude,
          longitude: batchData.location.longitude,
          zone: batchData.location.zone,
          timestamp: Math.floor(Date.now() / 1000)
        },
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

  async addQualityTestEvent(eventData: any) {
    if (!this.batchRegistryContract) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const tx = await this.batchRegistryContract.addQualityTestEvent(
        eventData.batchId,
        eventData.eventId,
        eventData.parentEventId,
        eventData.ipfsHash,
        {
          latitude: eventData.location.latitude,
          longitude: eventData.location.longitude,
          zone: eventData.location.zone,
          timestamp: Math.floor(Date.now() / 1000)
        },
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

  async addProcessingEvent(eventData: any) {
    if (!this.batchRegistryContract) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const tx = await this.batchRegistryContract.addProcessingEvent(
        eventData.batchId,
        eventData.eventId,
        eventData.parentEventId,
        eventData.ipfsHash,
        {
          latitude: eventData.location.latitude,
          longitude: eventData.location.longitude,
          zone: eventData.location.zone,
          timestamp: Math.floor(Date.now() / 1000)
        },
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

  async addManufacturingEvent(eventData: any) {
    if (!this.batchRegistryContract) {
      throw new Error('Batch registry contract not initialized');
    }

    try {
      const tx = await this.batchRegistryContract.addManufacturingEvent(
        eventData.batchId,
        eventData.eventId,
        eventData.parentEventId,
        eventData.ipfsHash,
        {
          latitude: eventData.location.latitude,
          longitude: eventData.location.longitude,
          zone: eventData.location.zone,
          timestamp: Math.floor(Date.now() / 1000)
        },
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
      return batchIds.map((batchId: string) => ({ batchId }));
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
}

// Global Web3 service instance
export const web3Service = new Web3Service();
export default web3Service;

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}