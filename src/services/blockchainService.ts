import web3Service from './web3Service';

class BlockchainService {
  async initialize() {
    try {
      return await web3Service.initialize();
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      return false;
    }
  }

  async createBatch(userAddress: string, batchData: any) {
    try {
      return await web3Service.createBatch(batchData);
    } catch (error) {
      console.error('Error creating batch:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addQualityTestEvent(userAddress: string, eventData: any) {
    try {
      return await web3Service.addQualityTestEvent(eventData);
    } catch (error) {
      console.error('Error adding quality test event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addProcessingEvent(userAddress: string, eventData: any) {
    try {
      return await web3Service.addProcessingEvent(eventData);
    } catch (error) {
      console.error('Error adding processing event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addManufacturingEvent(userAddress: string, eventData: any) {
    try {
      return await web3Service.addManufacturingEvent(eventData);
    } catch (error) {
      console.error('Error adding manufacturing event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getBatchEvents(batchId: string) {
    try {
      return await web3Service.getBatchEvents(batchId);
    } catch (error) {
      console.error('Error getting batch events:', error);
      return [];
    }
  }

  async getAllBatches() {
    try {
      return await web3Service.getAllBatches();
    } catch (error) {
      console.error('Error getting all batches:', error);
      return [];
    }
  }
  generateBatchId(): string {
    return web3Service.generateBatchId();
  }

  generateEventId(eventType: string): string {
    return web3Service.generateEventId(eventType);
  }
}

export const blockchainService = new BlockchainService();
export default blockchainService;