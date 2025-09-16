// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Simplified Batch Registry contract with reduced gas usage
contract SimpleBatchRegistry {
    enum EventType { COLLECTION, QUALITY_TEST, PROCESSING, MANUFACTURING }
    
    struct BatchEvent {
        string eventId;
        EventType eventType;
        address participant;
        string ipfsHash;
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
    event EventAdded(string indexed batchId, string indexed eventId, uint8 eventType, address participant);
    
    function createBatch(
        string memory _batchId,
        string memory _herbSpecies,
        string memory _ipfsHash,
        string memory _qrCodeHash
    ) external {
        require(!batches[_batchId].exists, "Batch exists");
        
        Batch storage batch = batches[_batchId];
        batch.batchId = _batchId;
        batch.herbSpecies = _herbSpecies;
        batch.exists = true;
        batch.creationTime = block.timestamp;
        
        string memory collectionEventId = string(abi.encodePacked("COLLECTION-", _batchId));
        
        BatchEvent storage collectionEvent = batch.events[collectionEventId];
        collectionEvent.eventId = collectionEventId;
        collectionEvent.eventType = EventType.COLLECTION;
        collectionEvent.participant = msg.sender;
        collectionEvent.ipfsHash = _ipfsHash;
        collectionEvent.timestamp = block.timestamp;
        collectionEvent.parentEventId = "";
        collectionEvent.qrCodeHash = _qrCodeHash;
        
        batch.eventIds.push(collectionEventId);
        eventExists[collectionEventId] = true;
        allBatchIds.push(_batchId);
        
        emit BatchCreated(_batchId, _herbSpecies, msg.sender);
        emit EventAdded(_batchId, collectionEventId, uint8(EventType.COLLECTION), msg.sender);
    }
    
    function addEvent(
        string memory _batchId,
        string memory _eventId,
        uint8 _eventType,
        string memory _parentEventId,
        string memory _ipfsHash,
        string memory _qrCodeHash
    ) external {
        require(batches[_batchId].exists, "Batch not found");
        require(!eventExists[_eventId], "Event exists");
        require(eventExists[_parentEventId], "Parent not found");
        
        Batch storage batch = batches[_batchId];
        BatchEvent storage newEvent = batch.events[_eventId];
        
        newEvent.eventId = _eventId;
        newEvent.eventType = EventType(_eventType);
        newEvent.participant = msg.sender;
        newEvent.ipfsHash = _ipfsHash;
        newEvent.timestamp = block.timestamp;
        newEvent.parentEventId = _parentEventId;
        newEvent.qrCodeHash = _qrCodeHash;
        
        batch.eventIds.push(_eventId);
        eventExists[_eventId] = true;
        
        emit EventAdded(_batchId, _eventId, _eventType, msg.sender);
    }
    
    function getBatchEvents(string memory _batchId) external view returns (string[] memory) {
        require(batches[_batchId].exists, "Batch not found");
        return batches[_batchId].eventIds;
    }
    
    function getEvent(string memory _batchId, string memory _eventId) external view returns (
        uint8 eventType,
        address participant,
        string memory ipfsHash,
        uint256 timestamp,
        string memory parentEventId,
        string memory qrCodeHash
    ) {
        require(batches[_batchId].exists, "Batch not found");
        BatchEvent storage batchEvent = batches[_batchId].events[_eventId];
        return (
            uint8(batchEvent.eventType),
            batchEvent.participant,
            batchEvent.ipfsHash,
            batchEvent.timestamp,
            batchEvent.parentEventId,
            batchEvent.qrCodeHash
        );
    }
    
    function getAllBatches() external view returns (string[] memory) {
        return allBatchIds;
    }
}