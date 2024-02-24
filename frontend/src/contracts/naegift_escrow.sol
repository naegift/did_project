// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract naegift_escrow {
    address public immutable buyer;
    address public immutable seller;
    address public immutable receiver;
    address public immutable market;
    uint256 public immutable contractPrice;
    enum ContractStateChoices {
        DEPLOYED,
        ACTIVE,
        FULFILLED,
        PRODUCT_USED,
        EXECUTED
    }
    ContractStateChoices public contractState;

    event CurrentState(ContractStateChoices state);
    event FulfillmentConfirmed(address indexed market);
    event ProductUsedConfirmed(address indexed receiver);
    event FundsDistributed(address indexed market, uint256 marketShare, address indexed seller, uint256 sellerShare);

    constructor(
        address _buyer,
        address _seller,
        address _receiver,
        address _market,
        uint256 _contractPrice
    ) payable {
        require(_buyer != _seller &&  
        _buyer != _market && 
        _seller != _receiver && 
        _seller != _market && 
        _receiver != _market, 'e001');
        buyer = _buyer;
        seller = _seller;
        receiver = _receiver;
        market = _market;
        contractPrice = _contractPrice;
        contractState = ContractStateChoices.ACTIVE;
    }
    
    // 상품 판매 완료
    function confirmFulfillment() external {
        require(msg.sender == market, 'e024');
        require(contractState == ContractStateChoices.ACTIVE, 'e013');
        contractState = ContractStateChoices.FULFILLED;
        emit FulfillmentConfirmed(msg.sender);
        emit CurrentState(contractState);
    }

    // 상품 사용 완료
    function confirmProductUsed() external {
        require(msg.sender == receiver, 'e020'); 
        require(contractState == ContractStateChoices.FULFILLED, 'e021');
        contractState = ContractStateChoices.PRODUCT_USED;
        emit ProductUsedConfirmed(msg.sender);
        emit CurrentState(contractState);
        distributeFunds(); 
    }

    // 판매 대금 정산
    function distributeFunds() private {
        require(contractState == ContractStateChoices.PRODUCT_USED, 'e022');
        uint256 marketShare = contractPrice / 10; 
        uint256 sellerShare = contractPrice - marketShare; 
        payable(market).transfer(marketShare);
        payable(seller).transfer(sellerShare);
        emit FundsDistributed(market, marketShare, seller, sellerShare);
        contractState = ContractStateChoices.EXECUTED;
        emit CurrentState(contractState);
    }

    receive() external payable {}
}
