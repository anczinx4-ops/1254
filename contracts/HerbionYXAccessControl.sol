// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HerbionYX Access Control
 * @dev Manages user roles and permissions for the Ayurvedic herb traceability system
 */
contract HerbionYXAccessControl {
    enum Role { NONE, COLLECTOR, TESTER, PROCESSOR, MANUFACTURER, ADMIN, CONSUMER }
    
    struct User {
        Role role;
        string name;
        string organization;
        bool isActive;
        uint256 registrationDate;
    }
    
    mapping(address => User) public users;
    mapping(Role => address[]) public roleMembers;
    
    address public admin;
    uint256 public totalUsers;
    
    event UserRegistered(address indexed user, uint8 role, string name, string organization);
    event UserDeactivated(address indexed user);
    event UserReactivated(address indexed user);
    
    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.ADMIN, "Only admin can perform this action");
        _;
    }
    
    modifier onlyRole(Role _role) {
        require(users[msg.sender].role == _role && users[msg.sender].isActive, "Insufficient permissions or inactive user");
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
            registrationDate: block.timestamp
        });
        roleMembers[Role.ADMIN].push(msg.sender);
        totalUsers = 1;
    }
    
    /**
     * @dev Register a new user with specified role
     */
    function registerUser(
        address _user,
        uint8 _role,
        string memory _name,
        string memory _organization
    ) external onlyAdmin {
        require(_role > 0 && _role <= 6, "Invalid role");
        require(_user != address(0), "Invalid address");
        require(users[_user].role == Role.NONE, "User already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_organization).length > 0, "Organization cannot be empty");
        
        Role userRole = Role(_role);
        users[_user] = User({
            role: userRole,
            name: _name,
            organization: _organization,
            isActive: true,
            registrationDate: block.timestamp
        });
        
        roleMembers[userRole].push(_user);
        totalUsers++;
        
        emit UserRegistered(_user, _role, _name, _organization);
    }
    
    /**
     * @dev Deactivate a user account
     */
    function deactivateUser(address _user) external onlyAdmin {
        require(users[_user].role != Role.NONE, "User not found");
        require(_user != admin, "Cannot deactivate admin");
        
        users[_user].isActive = false;
        emit UserDeactivated(_user);
    }
    
    /**
     * @dev Reactivate a user account
     */
    function reactivateUser(address _user) external onlyAdmin {
        require(users[_user].role != Role.NONE, "User not found");
        
        users[_user].isActive = true;
        emit UserReactivated(_user);
    }
    
    /**
     * @dev Check if user is authorized for a specific role
     */
    function isAuthorized(address _user, uint8 _requiredRole) external view returns (bool) {
        return uint8(users[_user].role) == _requiredRole && users[_user].isActive;
    }
    
    /**
     * @dev Get user information
     */
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
    
    /**
     * @dev Get all members of a specific role
     */
    function getRoleMembers(uint8 _role) external view returns (address[] memory) {
        require(_role > 0 && _role <= 6, "Invalid role");
        return roleMembers[Role(_role)];
    }
    
    /**
     * @dev Get total number of users
     */
    function getTotalUsers() external view returns (uint256) {
        return totalUsers;
    }
    
    /**
     * @dev Check if an address is registered
     */
    function isRegistered(address _user) external view returns (bool) {
        return users[_user].role != Role.NONE;
    }
}