// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AccessControl {
    enum Role { NONE, COLLECTOR, TESTER, PROCESSOR, MANUFACTURER, ADMIN }
    
    struct User {
        Role role;
        string name;
        string organization;
        bool isActive;
        uint256 registrationDate;
        string[] approvedZones;
    }
    
    mapping(address => User) public users;
    mapping(Role => address[]) public roleMembers;
    
    address public admin;
    
    event UserRegistered(address indexed user, Role role, string name);
    event UserDeactivated(address indexed user);
    event ZoneApproved(address indexed collector, string zone);
    
    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.ADMIN, "Only admin can perform this action");
        _;
    }
    
    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role, "Insufficient permissions");
        _;
    }
    
    modifier onlyActiveUser() {
        require(users[msg.sender].isActive, "User account is deactivated");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        users[msg.sender] = User({
            role: Role.ADMIN,
            name: "System Administrator",
            organization: "HerbionYX Platform",
            isActive: true,
            registrationDate: block.timestamp,
            approvedZones: new string[](0)
        });
        roleMembers[Role.ADMIN].push(msg.sender);
    }
    
    function registerUser(
        address _user,
        uint8 _role,
        string memory _name,
        string memory _organization
    ) external onlyAdmin {
        require(_role > 0 && _role <= 5, "Invalid role");
        require(_user != address(0), "Invalid address");
        require(users[_user].role == Role.NONE, "User already registered");
        
        Role userRole = Role(_role);
        users[_user] = User({
            role: userRole,
            name: _name,
            organization: _organization,
            isActive: true,
            registrationDate: block.timestamp,
            approvedZones: new string[](0)
        });
        
        roleMembers[userRole].push(_user);
        emit UserRegistered(_user, userRole, _name);
    }
    
    function approveZoneForCollector(address _collector, string memory _zone) 
        external onlyAdmin {
        require(users[_collector].role == Role.COLLECTOR, "User is not a collector");
        users[_collector].approvedZones.push(_zone);
        emit ZoneApproved(_collector, _zone);
    }
    
    function deactivateUser(address _user) external onlyAdmin {
        users[_user].isActive = false;
        emit UserDeactivated(_user);
    }
    
    function isAuthorized(address _user, uint8 _requiredRole) external view returns (bool) {
        return uint8(users[_user].role) == _requiredRole && users[_user].isActive;
    }
    
    function isCollectorApprovedForZone(address _collector, string memory _zone) 
        external view returns (bool) {
        if (users[_collector].role != Role.COLLECTOR || !users[_collector].isActive) {
            return false;
        }
        
        string[] memory zones = users[_collector].approvedZones;
        for (uint i = 0; i < zones.length; i++) {
            if (keccak256(bytes(zones[i])) == keccak256(bytes(_zone))) {
                return true;
            }
        }
        return false;
    }
    
    function getUserInfo(address _user) external view returns (
        uint8 role,
        string memory name,
        string memory organization,
        bool isActive,
        uint256 registrationDate,
        string[] memory approvedZones
    ) {
        User memory user = users[_user];
        return (
            uint8(user.role),
            user.name,
            user.organization,
            user.isActive,
            user.registrationDate,
            user.approvedZones
        );
    }
    
    function getRoleMembers(uint8 _role) external view returns (address[] memory) {
        return roleMembers[Role(_role)];
    }
}