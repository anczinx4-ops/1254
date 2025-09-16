class IPFSService {
  private baseUrl = '/api/ipfs';

  async uploadJSON(jsonData: any, name: string) {
    try {
      const response = await fetch(`${this.baseUrl}/upload-json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          jsonData,
          name
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload JSON to IPFS');
      }

      return data.data;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/upload-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload file to IPFS');
      }

      return data.data;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getFile(ipfsHash: string) {
    try {
      const response = await fetch(`${this.baseUrl}/get-file/${ipfsHash}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get file from IPFS');
      }

      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async createCollectionMetadata(collectionData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/create-collection-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          collectionData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create collection metadata');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating collection metadata:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async createQualityTestMetadata(testData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/create-quality-test-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          testData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create quality test metadata');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating quality test metadata:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async createProcessingMetadata(processData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/create-processing-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          processData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create processing metadata');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating processing metadata:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async createManufacturingMetadata(mfgData: any) {
    try {
      const response = await fetch(`${this.baseUrl}/create-manufacturing-metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          mfgData
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create manufacturing metadata');
      }

      return data.data;
    } catch (error) {
      console.error('Error creating manufacturing metadata:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export const ipfsService = new IPFSService();
export default ipfsService;