const { web3, CONTRACT_ADDRESSES, ADMIN_ACCOUNT } = require('../config/blockchain');
const fs = require('fs');
const path = require('path');

// Load contract ABIs
const ACCESS_CONTROL_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abis/AccessControl.json'), 'utf8')
).abi;

const BATCH_REGISTRY_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../abis/BatchRegistry.json'), 'utf8')
).abi;

class BlockchainService {
  constructor() {
    this.accessControlContract = null;
    this.batchRegistryContract = null;
    this.adminAccount = null;
    this.init();
  }

  async init() {
    try {
      // Initialize admin account
      this.adminAccount = web3.eth.accounts.privateKeyToAccount(ADMIN_ACCOUNT.privateKey);
      web3.eth.accounts.wallet.add(this.adminAccount);

      // Initialize contracts
      if (CONTRACT_ADDRESSES.ACCESS_CONTROL) {
        this.accessControlContract = new web3.eth.Contract(
          ACCESS_CONTROL_ABI,
          CONTRACT_ADDRESSES.ACCESS_CONTROL
        );
      }

      if (CONTRACT_ADDRESSES.BATCH_REGISTRY) {
        this.batchRegistryContract = new web3.eth.Contract(
          BATCH_REGISTRY_ABI,
          CONTRACT_ADDRESSES.BATCH_REGISTRY
        );
      }

      console.log('Blockchain service initialized successfully');
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
    }
  }

  // User Management
  async registerUser(userAddress, role, name, organization) {
    try {
      const tx = await this.accessControlContract.methods
        .registerUser(userAddress, role, name, organization)
        .send({
          from: this.adminAccount.address,
          gas: '1000000',
          gasPrice: '0'
        });

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: error.message };
    }
  }

  async approveZoneForCollector(collectorAddress, zone) {
    try {
      const tx = await this.accessControlContract.methods
        .approveZoneForCollector(collectorAddress, zone)
        .send({
          from: this.adminAccount.address,
          gas: '500000',
          gasPrice: '0'
        });

      return {
        success: true,
        transactionHash: tx.transactionHash
      };
    } catch (error) {
      console.error('Error approving zone:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserInfo(userAddress) {
    try {
      const userInfo = await this.accessControlContract.methods
        .getUserInfo(userAddress)
        .call();

      return {
        role: parseInt(userInfo.role),
        name: userInfo.name,
        organization: userInfo.organization,
        isActive: userInfo.isActive,
        registrationDate: parseInt(userInfo.registrationDate),
        approvedZones: userInfo.approvedZones
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  // Batch Management
  async createBatch(userAddress, userPrivateKey, batchData) {
    try {
      const account = web3.eth.accounts.privateKeyToAccount(userPrivateKey);
      web3.eth.accounts.wallet.add(account);

      const {
        batchId,
        herbSpecies,
        collectionEventId,
        ipfsHash,
        location,
        qrCodeHash
      } = batchData;

      const locationStruct = {
        latitude: location.latitude,
        longitude: location.longitude,
        zone: location.zone,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const tx = await this.batchRegistryContract.methods
        .createBatch(
          batchId,
          herbSpecies,
          collectionEventId,
          ipfsHash,
          locationStruct,
          qrCodeHash
        )
        .send({
          from: account.address,
          gas: '2000000',
          gasPrice: '0'
        });

      web3.eth.accounts.wallet.remove(account);

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      };
    } catch (error) {
      console.error('Error creating batch:', error);
      return { success: false, error: error.message };
    }
  }

  async addQualityTestEvent(userAddress, userPrivateKey, eventData) {
    try {
      const account = web3.eth.accounts.privateKeyToAccount(userPrivateKey);
      web3.eth.accounts.wallet.add(account);

      const {
        batchId,
        eventId,
        parentEventId,
        ipfsHash,
        location,
        qrCodeHash
      } = eventData;

      const locationStruct = {
        latitude: location.latitude,
        longitude: location.longitude,
        zone: location.zone,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const tx = await this.batchRegistryContract.methods
        .addQualityTestEvent(
          batchId,
          eventId,
          parentEventId,
          ipfsHash,
          locationStruct,
          qrCodeHash
        )
        .send({
          from: account.address,
          gas: '2000000',
          gasPrice: '0'
        });

      web3.eth.accounts.wallet.remove(account);

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      };
    } catch (error) {
      console.error('Error adding quality test event:', error);
      return { success: false, error: error.message };
    }
  }

  async addProcessingEvent(userAddress, userPrivateKey, eventData) {
    try {
      const account = web3.eth.accounts.privateKeyToAccount(userPrivateKey);
      web3.eth.accounts.wallet.add(account);

      const {
        batchId,
        eventId,
        parentEventId,
        ipfsHash,
        location,
        qrCodeHash
      } = eventData;

      const locationStruct = {
        latitude: location.latitude,
        longitude: location.longitude,
        zone: location.zone,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const tx = await this.batchRegistryContract.methods
        .addProcessingEvent(
          batchId,
          eventId,
          parentEventId,
          ipfsHash,
          locationStruct,
          qrCodeHash
        )
        .send({
          from: account.address,
          gas: '2000000',
          gasPrice: '0'
        });

      web3.eth.accounts.wallet.remove(account);

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      };
    } catch (error) {
      console.error('Error adding processing event:', error);
      return { success: false, error: error.message };
    }
  }

  async addManufacturingEvent(userAddress, userPrivateKey, eventData) {
    try {
      const account = web3.eth.accounts.privateKeyToAccount(userPrivateKey);
      web3.eth.accounts.wallet.add(account);

      const {
        batchId,
        eventId,
        parentEventId,
        ipfsHash,
        location,
        qrCodeHash
      } = eventData;

      const locationStruct = {
        latitude: location.latitude,
        longitude: location.longitude,
        zone: location.zone,
        timestamp: Math.floor(Date.now() / 1000)
      };

      const tx = await this.batchRegistryContract.methods
        .addManufacturingEvent(
          batchId,
          eventId,
          parentEventId,
          ipfsHash,
          locationStruct,
          qrCodeHash
        )
        .send({
          from: account.address,
          gas: '2000000',
          gasPrice: '0'
        });

      web3.eth.accounts.wallet.remove(account);

      return {
        success: true,
        transactionHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      };
    } catch (error) {
      console.error('Error adding manufacturing event:', error);
      return { success: false, error: error.message };
    }
  }

  // Query Methods
  async getBatchEvents(batchId) {
    try {
      const eventIds = await this.batchRegistryContract.methods
        .getBatchEvents(batchId)
        .call();

      const events = [];
      for (const eventId of eventIds) {
        const eventData = await this.batchRegistryContract.methods
          .getEvent(batchId, eventId)
          .call();

        events.push({
          eventId,
          eventType: parseInt(eventData.eventType),
          participant: eventData.participant,
          ipfsHash: eventData.ipfsHash,
          location: eventData.location,
          timestamp: parseInt(eventData.timestamp),
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
      const batchIds = await this.batchRegistryContract.methods
        .getAllBatches()
        .call();

      const batches = [];
      for (const batchId of batchIds) {
        const batchInfo = await this.batchRegistryContract.methods
          .getBatchInfo(batchId)
          .call();

        batches.push({
          batchId,
          herbSpecies: batchInfo.herbSpecies,
          creationTime: parseInt(batchInfo.creationTime),
          eventCount: parseInt(batchInfo.eventCount)
        });
      }

      return batches;
    } catch (error) {
      console.error('Error getting all batches:', error);
      return [];
    }
  }

  // Utility Methods
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

module.exports = new BlockchainService();