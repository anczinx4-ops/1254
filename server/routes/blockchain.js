const express = require('express');
const { authenticateToken } = require('./auth');
const blockchainService = require('../services/blockchainService');

const router = express.Router();

// Initialize blockchain service
router.post('/initialize', async (req, res) => {
  try {
    const result = await blockchainService.init();
    res.json({
      success: true,
      message: 'Blockchain service initialized',
      result
    });
  } catch (error) {
    console.error('Blockchain initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize blockchain service',
      details: error.message
    });
  }
});

// Create batch
router.post('/create-batch', authenticateToken, async (req, res) => {
  try {
    const { userAddress, batchData } = req.body;
    
    if (!userAddress || !batchData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await blockchainService.createBatch(userAddress, batchData);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Batch created successfully' : 'Failed to create batch'
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create batch',
      details: error.message
    });
  }
});

// Add quality test event
router.post('/add-quality-test', authenticateToken, async (req, res) => {
  try {
    const { userAddress, eventData } = req.body;
    
    if (!userAddress || !eventData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await blockchainService.addQualityTestEvent(userAddress, 'dummy-key', eventData);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Quality test event added successfully' : 'Failed to add quality test event'
    });
  } catch (error) {
    console.error('Add quality test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add quality test event',
      details: error.message
    });
  }
});

// Add processing event
router.post('/add-processing', authenticateToken, async (req, res) => {
  try {
    const { userAddress, eventData } = req.body;
    
    if (!userAddress || !eventData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await blockchainService.addProcessingEvent(userAddress, 'dummy-key', eventData);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Processing event added successfully' : 'Failed to add processing event'
    });
  } catch (error) {
    console.error('Add processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add processing event',
      details: error.message
    });
  }
});

// Add manufacturing event
router.post('/add-manufacturing', authenticateToken, async (req, res) => {
  try {
    const { userAddress, eventData } = req.body;
    
    if (!userAddress || !eventData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await blockchainService.addManufacturingEvent(userAddress, 'dummy-key', eventData);
    
    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Manufacturing event added successfully' : 'Failed to add manufacturing event'
    });
  } catch (error) {
    console.error('Add manufacturing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add manufacturing event',
      details: error.message
    });
  }
});

// Get batch events
router.get('/batch-events/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    
    if (!batchId) {
      return res.status(400).json({
        success: false,
        error: 'Batch ID is required'
      });
    }

    const events = await blockchainService.getBatchEvents(batchId);
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get batch events error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get batch events',
      details: error.message
    });
  }
});

// Get all batches
router.get('/all-batches', async (req, res) => {
  try {
    const batches = await blockchainService.getAllBatches();
    
    res.json({
      success: true,
      data: batches
    });
  } catch (error) {
    console.error('Get all batches error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get all batches',
      details: error.message
    });
  }
});

// Generate batch ID
router.get('/generate-batch-id', (req, res) => {
  try {
    const batchId = blockchainService.generateBatchId();
    
    res.json({
      success: true,
      data: { batchId }
    });
  } catch (error) {
    console.error('Generate batch ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate batch ID',
      details: error.message
    });
  }
});

// Generate event ID
router.post('/generate-event-id', (req, res) => {
  try {
    const { eventType } = req.body;
    
    if (!eventType) {
      return res.status(400).json({
        success: false,
        error: 'Event type is required'
      });
    }

    const eventId = blockchainService.generateEventId(eventType);
    
    res.json({
      success: true,
      data: { eventId }
    });
  } catch (error) {
    console.error('Generate event ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate event ID',
      details: error.message
    });
  }
});

module.exports = router;