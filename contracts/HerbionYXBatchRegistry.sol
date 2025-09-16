// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./HerbionYXAccessControl.sol";

/**
 * @title HerbionYX Batch Registry
 * @dev Manages the complete supply chain tracking for Ayurvedic herbs
 */
contract HerbionYXBatchRegistry {
    HerbionYXAccessControl public accessControl;
    
    enum EventType { COLLECTION, QUALITY_TEST, PROCESSING, MANUFACTURING }
    
    struct GeolocationData {
        string latitude;
        string longitude;
        string zone;
        uint256 timestamp;
    }
    
    struct BatchEvent {
        string eventId;
        EventType eventType;
        address participant;
        string participantName;
        string ipfsHash;
        GeolocationData location;
        uint256 timestamp;
        string parentEventId;
        string qrCodeHash;
        bool exists;
    }
    
    struct Batch {
        string batchId;
        string herbSpecies;
        address creator;
        bool exists;
        string[] eventIds;
        mapping(string => BatchEvent) events;
        uint256 creationTime;
        uint256 lastUpdated;
    }
    
    mapping(string => Batch) public batches;
    mapping(string => bool) public eventExists;
    mapping(string => string) public eventToBatch; // eventId => batchId
    string[] public allBatchIds;
    
    uint256 public totalBatches;
    uint256 public totalEvents;
    
    event BatchCreated(
        string indexed batchId, 
        string herbSpecies, 
        address indexed creator,
        string creatorName,
        uint256 timestamp
    );
    
    event EventAdded(
        string indexed batchId, 
        string indexed eventId, 
        EventType eventType, 
        address indexed participant,
        string participantName,
        uint256 timestamp
    );
    
    event QRCodeGenerated(string indexed eventId, string qrCodeHash);
    
    modifier onlyAuthorizedUser(uint8 requiredRole) {
        require(
            accessControl.isAuthorized(msg.sender, requiredRole),
            "Unauthorized user or role"
        );
        _;
    }
    
    modifier batchExists(string memory _batchId) {
        require(batches[_batchId].exists, "Batch does not exist");
        _;
    }
    
    modifier eventNotExists(string memory _eventId) {
        require(!eventExists[_eventId], "Event ID already exists");
        _;
    }
    
    modifier parentEventExists(string memory _parentEventId) {
        if (bytes(_parentEventId).length > 0) {
            require(eventExists[_parentEventId], "Parent event does not exist");
        }
        _;
    }
    
    constructor(address _accessControlAddress) {
        require(_accessControlAddress != address(0), "Invalid access control address");
        accessControl = HerbionYXAccessControl(_accessControlAddress);
    }
    
    /**
     * @dev Create a new batch with collection event
     */
    function createBatch(
        string memory _batchId,
        string memory _herbSpecies,
        string memory _collectionEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash
    ) external onlyAuthorizedUser(1) eventNotExists(_collectionEventId) {
        require(!batches[_batchId].exists, "Batch already exists");
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        require(bytes(_herbSpecies).length > 0, "Herb species cannot be empty");
        require(bytes(_collectionEventId).length > 0, "Event ID cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        // Get user info
        (, string memory userName, , ,) = accessControl.getUserInfo(msg.sender);
        
        Batch storage batch = batches[_batchId];
        batch.batchId = _batchId;
        batch.herbSpecies = _herbSpecies;
        batch.creator = msg.sender;
        batch.exists = true;
        batch.creationTime = block.timestamp;
        batch.lastUpdated = block.timestamp;
        
        BatchEvent storage collectionEvent = batch.events[_collectionEventId];
        collectionEvent.eventId = _collectionEventId;
        collectionEvent.eventType = EventType.COLLECTION;
        collectionEvent.participant = msg.sender;
        collectionEvent.participantName = userName;
        collectionEvent.ipfsHash = _ipfsHash;
        collectionEvent.location = _location;
        collectionEvent.timestamp = block.timestamp;
        collectionEvent.parentEventId = "";
        collectionEvent.qrCodeHash = _qrCodeHash;
        collectionEvent.exists = true;
        
        batch.eventIds.push(_collectionEventId);
        eventExists[_collectionEventId] = true;
        eventToBatch[_collectionEventId] = _batchId;
        allBatchIds.push(_batchId);
        
        totalBatches++;
        totalEvents++;
        
        emit BatchCreated(_batchId, _herbSpecies, msg.sender, userName, block.timestamp);
        emit EventAdded(_batchId, _collectionEventId, EventType.COLLECTION, msg.sender, userName, block.timestamp);
        emit QRCodeGenerated(_collectionEventId, _qrCodeHash);
    }
    
    /**
     * @dev Add quality test event
     */
    function addQualityTestEvent(
        string memory _batchId,
        string memory _eventId,
        string memory _parentEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash
    ) external onlyAuthorizedUser(2) batchExists(_batchId) eventNotExists(_eventId) parentEventExists(_parentEventId) {
        _addEvent(_batchId, _eventId, _parentEventId, _ipfsHash, _location, _qrCodeHash, EventType.QUALITY_TEST);
    }
    
    /**
     * @dev Add processing event
     */
    function addProcessingEvent(
        string memory _batchId,
        string memory _eventId,
        string memory _parentEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash
    ) external onlyAuthorizedUser(3) batchExists(_batchId) eventNotExists(_eventId) parentEventExists(_parentEventId) {
        _addEvent(_batchId, _eventId, _parentEventId, _ipfsHash, _location, _qrCodeHash, EventType.PROCESSING);
    }
    
    /**
     * @dev Add manufacturing event
     */
    function addManufacturingEvent(
        string memory _batchId,
        string memory _eventId,
        string memory _parentEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash
    ) external onlyAuthorizedUser(4) batchExists(_batchId) eventNotExists(_eventId) parentEventExists(_parentEventId) {
        _addEvent(_batchId, _eventId, _parentEventId, _ipfsHash, _location, _qrCodeHash, EventType.MANUFACTURING);
    }
    
    /**
     * @dev Internal function to add events
     */
    function _addEvent(
        string memory _batchId,
        string memory _eventId,
        string memory _parentEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash,
        EventType _eventType
    ) internal {
        require(bytes(_eventId).length > 0, "Event ID cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        // Get user info
        (, string memory userName, , ,) = accessControl.getUserInfo(msg.sender);
        
        Batch storage batch = batches[_batchId];
        BatchEvent storage newEvent = batch.events[_eventId];
        
        newEvent.eventId = _eventId;
        newEvent.eventType = _eventType;
        newEvent.participant = msg.sender;
        newEvent.participantName = userName;
        newEvent.ipfsHash = _ipfsHash;
        newEvent.location = _location;
        newEvent.timestamp = block.timestamp;
        newEvent.parentEventId = _parentEventId;
        newEvent.qrCodeHash = _qrCodeHash;
        newEvent.exists = true;
        
        batch.eventIds.push(_eventId);
        batch.lastUpdated = block.timestamp;
        eventExists[_eventId] = true;
        eventToBatch[_eventId] = _batchId;
        
        totalEvents++;
        
        emit EventAdded(_batchId, _eventId, _eventType, msg.sender, userName, block.timestamp);
        emit QRCodeGenerated(_eventId, _qrCodeHash);
    }
    
    /**
     * @dev Get all event IDs for a batch
     */
    function getBatchEvents(string memory _batchId) 
        external view batchExists(_batchId) returns (string[] memory) {
        return batches[_batchId].eventIds;
    }
    
    /**
     * @dev Get specific event details
     */
    function getEvent(string memory _batchId, string memory _eventId) 
        external view batchExists(_batchId) returns (
            EventType eventType,
            address participant,
            string memory participantName,
            string memory ipfsHash,
            GeolocationData memory location,
            uint256 timestamp,
            string memory parentEventId,
            string memory qrCodeHash
        ) {
        BatchEvent storage batchEvent = batches[_batchId].events[_eventId];
        require(batchEvent.exists, "Event does not exist");
        
        return (
            batchEvent.eventType,
            batchEvent.participant,
            batchEvent.participantName,
            batchEvent.ipfsHash,
            batchEvent.location,
            batchEvent.timestamp,
            batchEvent.parentEventId,
            batchEvent.qrCodeHash
        );
    }
    
    /**
     * @dev Get all batch IDs
     */
    function getAllBatches() external view returns (string[] memory) {
        return allBatchIds;
    }
    
    /**
     * @dev Get batch information
     */
    function getBatchInfo(string memory _batchId) 
        external view batchExists(_batchId) returns (
            string memory herbSpecies,
            address creator,
            uint256 creationTime,
            uint256 lastUpdated,
            uint256 eventCount
        ) {
        Batch storage batch = batches[_batchId];
        return (
            batch.herbSpecies,
            batch.creator,
            batch.creationTime,
            batch.lastUpdated,
            batch.eventIds.length
        );
    }
    
    /**
     * @dev Find batch ID by event ID
     */
    function getBatchByEventId(string memory _eventId) external view returns (string memory) {
        require(eventExists[_eventId], "Event does not exist");
        return eventToBatch[_eventId];
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 _totalBatches,
        uint256 _totalEvents,
        uint256 _totalUsers
    ) {
        return (totalBatches, totalEvents, accessControl.getTotalUsers());
    }
    
    /**
     * @dev Check if event exists
     */
    function doesEventExist(string memory _eventId) external view returns (bool) {
        return eventExists[_eventId];
    }
}