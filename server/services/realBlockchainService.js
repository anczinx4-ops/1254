const { ethers } = require('ethers');
const {
  provider,
  masterWallet,
  collectorWallet,
  testerWallet,
  processorWallet,
  manufacturerWallet,
  ACCESS_CONTROL_ABI,
  BATCH_REGISTRY_ABI,
  CONTRACT_ADDRESSES
} = require('../config/blockchain');

class RealBlockchainService {
  constructor() {
    this.accessControlContract = null;
    this.batchRegistryContract = null;
    this.initialized = false;
  }

  async init() {
    try {
      if (CONTRACT_ADDRESSES.ACCESS_CONTROL && CONTRACT_ADDRESSES.BATCH_REGISTRY) {
        this.accessControlContract = new ethers.Contract(
          CONTRACT_ADDRESSES.ACCESS_CONTROL,
          ACCESS_CONTROL_ABI,
          masterWallet
        );

        this.batchRegistryContract = new ethers.Contract(
          CONTRACT_ADDRESSES.BATCH_REGISTRY,
          BATCH_REGISTRY_ABI,
          masterWallet
        );

        // Register demo users
        await this.registerDemoUsers();
        
        this.initialized = true;
        console.log('✅ Real blockchain service initialized on Polygon Mumbai');
        return { success: true };
      } else {
        throw new Error('Contract addresses not configured');
      }
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      return { success: false, error: error.message };
    }
  }

  async registerDemoUsers() {
    try {
      const users = [
        { address: collectorWallet.address, role: 1, name: 'John Collector', org: 'Himalayan Herbs Co.' },
        { address: testerWallet.address, role: 2, name: 'Sarah Tester', org: 'Quality Labs Inc.' },
        { address: processorWallet.address, role: 3, name: 'Mike Processor', org: 'Herbal Processing Ltd.' },
        { address: manufacturerWallet.address, role: 4, name: 'Lisa Manufacturer', org: 'Ayurvedic Products Inc.' }
      ];

      for (const user of users) {
        try {
          const isRegistered = await this.accessControlContract.isAuthorized(user.address, user.role);
          if (!isRegistered) {
            const tx = await this.accessControlContract.registerUser(
              user.address,
              user.role,
              user.name,
              user.org,
              { gasLimit: 200000 }
            );
            await tx.wait();
            console.log(`✅ Registered user: ${user.name}`);
          }
        } catch (error) {
          console.log(`User ${user.name} already registered or error:`, error.message);
        }
      }
    } catch (error) {
      console.error('Error registering demo users:', error);
    }
  }

  getWalletForRole(role) {
    switch (role) {
      case 1: return collectorWallet;
      case 2: return testerWallet;
      case 3: return processorWallet;
      case 4: return manufacturerWallet;
      default: return masterWallet;
    }
  }

  async createBatch(userAddress, userRole, batchData) {
    try {
      const wallet = this.getWalletForRole(userRole);
      const contract = this.batchRegistryContract.connect(wallet);

      const tx = await contract.createBatch(
        batchData.batchId,
        batchData.herbSpecies,
        batchData.ipfsHash,
        batchData.qrCodeHash,
        { gasLimit: 300000 }
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        explorerUrl: `https://mumbai.polygonscan.com/tx/${receipt.hash}`
      };
    } catch (error) {
      console.error('Error creating batch:', error);
      return { success: false, error: error.message };
    }
  }

  async addEvent(userAddress, userRole, eventData, eventType) {
    try {
      const wallet = this.getWalletForRole(userRole);
      const contract = this.batchRegistryContract.connect(wallet);

      const tx = await contract.addEvent(
        eventData.batchId,
        eventData.eventId,
        eventType,
        eventData.parentEventId,
        eventData.ipfsHash,
        eventData.qrCodeHash,
        { gasLimit: 250000 }
      );

      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        explorerUrl: `https://mumbai.polygonscan.com/tx/${receipt.hash}`
      };
    } catch (error) {
      console.error('Error adding event:', error);
      return { success: false, error: error.message };
    }
  }

  async getBatchEvents(batchId) {
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
    try {
      const batchIds = await this.batchRegistryContract.getAllBatches();
      const batches = [];

      for (const batchId of batchIds) {
        const events = await this.getBatchEvents(batchId);
        const firstEvent = events[0];
        
        batches.push({
          batchId,
          herbSpecies: 'Unknown', // Would need to store this in contract
          creationTime: firstEvent ? firstEvent.timestamp : 0,
          eventCount: events.length
        });
      }

      return batches;
    } catch (error) {
      console.error('Error getting all batches:', error);
      return [];
    }
  }

  generateBatchId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `HERB-${timestamp}-${random}`;
  }

  generateEventId(eventType) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${eventType}-${timestamp}-${random}`;
  }
}

module.exports = new RealBlockchainService();