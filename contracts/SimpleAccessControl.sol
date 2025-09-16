// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Simplified Access Control contract with reduced gas usage
contract SimpleAccessControl {
    enum Role { NONE, COLLECTOR, TESTER, PROCESSOR, MANUFACTURER, ADMIN }
    
    struct User {
        Role role;
        string name;
        string organization;
        bool isActive;
        uint256 registrationDate;
    }
    
    mapping(address => User) public users;
    address public admin;
    
    event UserRegistered(address indexed user, uint8 role, string name);
    
    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.ADMIN, "Only admin");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        users[msg.sender] = User({
            role: Role.ADMIN,
            name: "System Administrator",
            organization: "HerbionYX Platform",
            isActive: true,
            registrationDate: block.timestamp
        });
    }
    
    function registerUser(
        address _user,
        uint8 _role,
        string memory _name,
        string memory _organization
    ) external onlyAdmin {
        require(_role > 0 && _role <= 5, "Invalid role");
        require(_user != address(0), "Invalid address");
        
        Role userRole = Role(_role);
        users[_user] = User({
            role: userRole,
            name: _name,
            organization: _organization,
            isActive: true,
            registrationDate: block.timestamp
        });
        
        emit UserRegistered(_user, _role, _name);
    }
    
    function isAuthorized(address _user, uint8 _requiredRole) external view returns (bool) {
        return uint8(users[_user].role) == _requiredRole && users[_user].isActive;
    }
    
    function getUserInfo(address _user) external view returns (
        uint8 role,
        string memory name,
        string memory organization,
        bool isActive,
        uint256 registrationDate
    ) {
        User memory user = users[_user];
        return (
            uint8(user.role),
            user.name,
            user.organization,
            user.isActive,
            user.registrationDate
        );
    }
}