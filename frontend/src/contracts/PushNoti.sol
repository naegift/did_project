// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IntegratedSubscription {

    address public pushChannelAdmin;
    address public MarketAddress;

    event SendNotification(address indexed channel, address indexed recipient, bytes identity);
    event Subscribe(address indexed channel, address indexed user);
    event UserAuthenticated(address indexed user); 

    // 관리자 또는 마켓만 호출 가능
    modifier onlyAdminOrMarket() {
        require(msg.sender == pushChannelAdmin || msg.sender == MarketAddress, "e001");
        _;
    }
    
    constructor(address _pushChannelAdmin, address _MarketAddress) {
        pushChannelAdmin = _pushChannelAdmin;
        MarketAddress = _MarketAddress;
    }    

    // 상품 사용 알림
    function sendProductUsageNotification(address _seller, bytes memory _identity) external onlyAdminOrMarket {
        require(isSubscribed[_seller], "e003");
        emit SendNotification(address(this), _seller, _identity);
    }
}