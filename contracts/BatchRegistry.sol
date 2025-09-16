// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AccessControl.sol";

contract BatchRegistry {
    AccessControl public accessControl;
    
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
        string ipfsHash;
        GeolocationData location;
        uint256 timestamp;
        string parentEventId;
        string qrCodeHash;
    }
    
    struct Batch {
        string batchId;
        string herbSpecies;
        bool exists;
        string[] eventIds;
        mapping(string => BatchEvent) events;
        uint256 creationTime;
    }
    
    mapping(string => Batch) public batches;
    mapping(string => bool) public eventExists;
    string[] public allBatchIds;
    
    event BatchCreated(string indexed batchId, string herbSpecies, address collector);
    event EventAdded(string indexed batchId, string indexed eventId, EventType eventType, address participant);
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
    
    constructor(address _accessControlAddress) {
        accessControl = AccessControl(_accessControlAddress);
    }
    
    function createBatch(
        string memory _batchId,
        string memory _herbSpecies,
        string memory _collectionEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash
    ) external onlyAuthorizedUser(1) {
        require(!batches[_batchId].exists, "Batch already exists");
        
        Batch storage batch = batches[_batchId];
        batch.batchId = _batchId;
        batch.herbSpecies = _herbSpecies;
        batch.exists = true;
        batch.creationTime = block.timestamp;
        
        BatchEvent storage collectionEvent = batch.events[_collectionEventId];
        collectionEvent.eventId = _collectionEventId;
        collectionEvent.eventType = EventType.COLLECTION;
        collectionEvent.participant = msg.sender;
        collectionEvent.ipfsHash = _ipfsHash;
        collectionEvent.location = _location;
        collectionEvent.timestamp = block.timestamp;
        collectionEvent.parentEventId = "";
        collectionEvent.qrCodeHash = _qrCodeHash;
        
        batch.eventIds.push(_collectionEventId);
        eventExists[_collectionEventId] = true;
        allBatchIds.push(_batchId);
        
        emit BatchCreated(_batchId, _herbSpecies, msg.sender);
        emit EventAdded(_batchId, _collectionEventId, EventType.COLLECTION, msg.sender);
        emit QRCodeGenerated(_collectionEventId, _qrCodeHash);
    }
    
    function addQualityTestEvent(
        string memory _batchId,
        string memory _eventId,
        string memory _parentEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash
    ) external onlyAuthorizedUser(2) batchExists(_batchId) {
        require(!eventExists[_eventId], "Event ID already exists");
        require(eventExists[_parentEventId], "Parent event does not exist");
        
        Batch storage batch = batches[_batchId];
        BatchEvent storage testEvent = batch.events[_eventId];
        
        testEvent.eventId = _eventId;
        testEvent.eventType = EventType.QUALITY_TEST;
        testEvent.participant = msg.sender;
        testEvent.ipfsHash = _ipfsHash;
        testEvent.location = _location;
        testEvent.timestamp = block.timestamp;
        testEvent.parentEventId = _parentEventId;
        testEvent.qrCodeHash = _qrCodeHash;
        
        batch.eventIds.push(_eventId);
        eventExists[_eventId] = true;
        
        emit EventAdded(_batchId, _eventId, EventType.QUALITY_TEST, msg.sender);
        emit QRCodeGenerated(_eventId, _qrCodeHash);
    }
    
    function addProcessingEvent(
        string memory _batchId,
        string memory _eventId,
        string memory _parentEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash
    ) external onlyAuthorizedUser(3) batchExists(_batchId) {
        require(!eventExists[_eventId], "Event ID already exists");
        require(eventExists[_parentEventId], "Parent event does not exist");
        
        Batch storage batch = batches[_batchId];
        BatchEvent storage processEvent = batch.events[_eventId];
        
        processEvent.eventId = _eventId;
        processEvent.eventType = EventType.PROCESSING;
        processEvent.participant = msg.sender;
        processEvent.ipfsHash = _ipfsHash;
        processEvent.location = _location;
        processEvent.timestamp = block.timestamp;
        processEvent.parentEventId = _parentEventId;
        processEvent.qrCodeHash = _qrCodeHash;
        
        batch.eventIds.push(_eventId);
        eventExists[_eventId] = true;
        
        emit EventAdded(_batchId, _eventId, EventType.PROCESSING, msg.sender);
        emit QRCodeGenerated(_eventId, _qrCodeHash);
    }
    
    function addManufacturingEvent(
        string memory _batchId,
        string memory _eventId,
        string memory _parentEventId,
        string memory _ipfsHash,
        GeolocationData memory _location,
        string memory _qrCodeHash
    ) external onlyAuthorizedUser(4) batchExists(_batchId) {
        require(!eventExists[_eventId], "Event ID already exists");
        require(eventExists[_parentEventId], "Parent event does not exist");
        
        Batch storage batch = batches[_batchId];
        BatchEvent storage mfgEvent = batch.events[_eventId];
        
        mfgEvent.eventId = _eventId;
        mfgEvent.eventType = EventType.MANUFACTURING;
        mfgEvent.participant = msg.sender;
        mfgEvent.ipfsHash = _ipfsHash;
        mfgEvent.location = _location;
        mfgEvent.timestamp = block.timestamp;
        mfgEvent.parentEventId = _parentEventId;
        mfgEvent.qrCodeHash = _qrCodeHash;
        
        batch.eventIds.push(_eventId);
        eventExists[_eventId] = true;
        
        emit EventAdded(_batchId, _eventId, EventType.MANUFACTURING, msg.sender);
        emit QRCodeGenerated(_eventId, _qrCodeHash);
    }
    
    function getBatchEvents(string memory _batchId) 
        external view batchExists(_batchId) returns (string[] memory) {
        return batches[_batchId].eventIds;
    }
    
    function getEvent(string memory _batchId, string memory _eventId) 
        external view batchExists(_batchId) returns (
            EventType eventType,
            address participant,
            string memory ipfsHash,
            GeolocationData memory location,
            uint256 timestamp,
            string memory parentEventId,
            string memory qrCodeHash
        ) {
        BatchEvent storage batchEvent = batches[_batchId].events[_eventId];
        return (
            batchEvent.eventType,
            batchEvent.participant,
            batchEvent.ipfsHash,
            batchEvent.location,
            batchEvent.timestamp,
            batchEvent.parentEventId,
            batchEvent.qrCodeHash
        );
    }
    
    function getAllBatches() external view returns (string[] memory) {
        return allBatchIds;
    }
    
    function getBatchInfo(string memory _batchId) 
        external view batchExists(_batchId) returns (
            string memory herbSpecies,
            uint256 creationTime,
            uint256 eventCount
        ) {
        Batch storage batch = batches[_batchId];
        return (
            batch.herbSpecies,
            batch.creationTime,
            batch.eventIds.length
        );
    }
}