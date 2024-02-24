// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PushNotification {
    address[] private subscribers;

    event SendNotification(address indexed channel, address indexed recipient, bytes identity);
    event Subscribe(address indexed channel, address indexed user);

    address public pushChannelAdmin;
    address public MarketAddress;
    mapping(address => bool) public usersSubscribed;

    modifier onlyAdminOrMarket() {
        require(msg.sender == pushChannelAdmin || msg.sender == MarketAddress, "e001");
        _;
    }

    function initialize(address _user, address _pushChannelAdmin, address _MarketAddress) public {
        pushChannelAdmin = _pushChannelAdmin;
        MarketAddress = _MarketAddress;
        _subscribe(_user);
    }

    function _subscribe(address _user) private {
        require(!usersSubscribed[_user], "e002");
        usersSubscribed[_user] = true;
        emit Subscribe(address(this), _user);
    }

    function sendProductUsageNotification(address _seller, bytes memory _identity) external onlyAdminOrMarket {
        require(usersSubscribed[_seller], "e003");
        emit SendNotification(address(this), _seller, _identity);
    }
}