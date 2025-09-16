// Real blockchain service that uses backend-managed transactions
// No wallet popups, no gas costs for users, but real blockchain and IPFS
class BlockchainService {
  private baseUrl = '/api/blockchain';
  private initialized = false;

  async initialize() {
    if (this.initialized) return true;
    
    try {
      const response = await fetch(`${this.baseUrl}/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize blockchain');
      }

      this.initialized = true;
      console.log('✅ Real blockchain network initialized');
      return true;
    } catch (error) {
      console.error('Error initializing blockchain:', error);
      return false;
    }
  }

  async createBatch(userAddress: string, batchData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/create-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userAddress,
          batchData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create batch');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating batch:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addQualityTestEvent(userAddress: string, eventData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/add-quality-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userAddress,
          eventData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add quality test event');
      }

      return data.data;
    } catch (error) {
      console.error('Error adding quality test event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addProcessingEvent(userAddress: string, eventData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/add-processing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userAddress,
          eventData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add processing event');
      }

      return data.data;
    } catch (error) {
      console.error('Error adding processing event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async addManufacturingEvent(userAddress: string, eventData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/add-manufacturing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userAddress,
          eventData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add manufacturing event');
      }

      return data.data;
    } catch (error) {
      console.error('Error adding manufacturing event:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getBatchEvents(batchId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/batch-events/${batchId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get batch events');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting batch events:', error);
      return [];
    }
  }

  async getAllBatches() {
    try {
      const response = await fetch(`${this.baseUrl}/all-batches`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get all batches');
      }

      return data.data;
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

export const blockchainService = new BlockchainService();
export default blockchainService;