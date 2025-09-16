class IPFSService {
  private pinataApiUrl = 'https://api.pinata.cloud';
  private pinataApiKey = process.env.VITE_PINATA_API_KEY || '';
  private pinataSecretKey = process.env.VITE_PINATA_SECRET_KEY || '';

  async uploadJSON(jsonData: any, name: string) {
    try {
      const response = await fetch(`${this.pinataApiUrl}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        },
        body: JSON.stringify({
          pinataContent: jsonData,
          pinataMetadata: {
            name: name || 'herb-metadata'
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          ipfsHash: data.IpfsHash,
          pinataUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
        };
      } else {
        throw new Error(data.error || 'Failed to upload to IPFS');
      }
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async uploadFile(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pinataMetadata', JSON.stringify({
        name: file.name
      }));

      const response = await fetch(`${this.pinataApiUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        return {
          success: true,
          ipfsHash: data.IpfsHash,
          pinataUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
        };
      } else {
        throw new Error(data.error || 'Failed to upload file to IPFS');
      }
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async getFile(ipfsHash: string) {
    try {
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      const data = await response.json();
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  async createCollectionMetadata(collectionData: any) {
    const metadata = {
      type: 'collection',
      timestamp: new Date().toISOString(),
      batchId: collectionData.batchId,
      herbSpecies: collectionData.herbSpecies,
      collector: collectionData.collector,
      weight: collectionData.weight,
      harvestDate: collectionData.harvestDate,
      location: collectionData.location,
      qualityGrade: collectionData.qualityGrade || '',
      notes: collectionData.notes || '',
      images: collectionData.images || []
    };

    return await this.uploadJSON(metadata, `collection-${collectionData.batchId}`);
  }

  async createQualityTestMetadata(testData: any) {
    const metadata = {
      type: 'quality_test',
      timestamp: new Date().toISOString(),
      batchId: testData.batchId,
      eventId: testData.eventId,
      parentEventId: testData.parentEventId,
      tester: testData.tester,
      testResults: {
        moistureContent: testData.moistureContent,
        purity: testData.purity,
        pesticideLevel: testData.pesticideLevel
      },
      testMethod: testData.testMethod || '',
      testDate: testData.testDate,
      notes: testData.notes || '',
      images: testData.images || []
    };

    return await this.uploadJSON(metadata, `quality-test-${testData.eventId}`);
  }

  async createProcessingMetadata(processData: any) {
    const metadata = {
      type: 'processing',
      timestamp: new Date().toISOString(),
      batchId: processData.batchId,
      eventId: processData.eventId,
      parentEventId: processData.parentEventId,
      processor: processData.processor,
      processingDetails: {
        method: processData.method,
        temperature: processData.temperature,
        duration: processData.duration,
        yield: processData.yield
      },
      processDate: processData.processDate,
      notes: processData.notes || '',
      images: processData.images || []
    };

    return await this.uploadJSON(metadata, `processing-${processData.eventId}`);
  }

  async createManufacturingMetadata(mfgData: any) {
    const metadata = {
      type: 'manufacturing',
      timestamp: new Date().toISOString(),
      batchId: mfgData.batchId,
      eventId: mfgData.eventId,
      parentEventId: mfgData.parentEventId,
      manufacturer: mfgData.manufacturer,
      product: {
        name: mfgData.productName,
        type: mfgData.productType,
        quantity: mfgData.quantity,
        unit: mfgData.unit,
        expiryDate: mfgData.expiryDate
      },
      manufacturingDate: mfgData.manufacturingDate,
      notes: mfgData.notes || '',
      images: mfgData.images || []
    };

    return await this.uploadJSON(metadata, `manufacturing-${mfgData.eventId}`);
  }
}

export const ipfsService = new IPFSService();
export default ipfsService;