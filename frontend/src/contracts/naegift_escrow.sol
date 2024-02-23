// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract naegift_escrow {
    address public buyer;
    address public seller;
    address public receiver;
    address public market;
    uint256 public contractPrice;
    enum ContractStateChoices {
        DEPLOYED,
        ACTIVE,
        FULFILLED,
        PRODUCT_USED,
        EXECUTED
    }
    ContractStateChoices public ContractState;

    event DepositConfirmed(address indexed buyer, uint256 amount);
    event FulfillmentConfirmed(address indexed market);
    event ProductUsedConfirmed(address indexed receiver);
    event FundsDistributed(address indexed market, uint256 marketShare, address indexed seller, uint256 sellerShare);
    
    
    constructor() {
        ContractState = ContractStateChoices.DEPLOYED;
    }

    function initialize(
        address _buyer,
        address _seller,
        address _receiver,
        address _market,
        uint256 _contractPrice
    ) public {
        require(_buyer != _seller &&  
        _buyer != _market && 
        _seller != _receiver && 
        _seller != _market && 
        _receiver != _market, 'e001');
        require(_contractPrice > 0, 'e006');
        buyer = _buyer;
        seller = _seller;
        receiver = _receiver;
        market = _market;
        contractPrice = _contractPrice;
        ContractState = ContractStateChoices.DEPLOYED;
    }

    // 입금 확인
    function confirmDeposit() external payable {
        require(msg.sender == buyer, "e003");
        require(ContractState == ContractStateChoices.DEPLOYED, 'e013');
        require(address(this).balance >= contractPrice, 'e002');
        ContractState = ContractStateChoices.ACTIVE;
        emit DepositConfirmed(msg.sender, msg.value);
    }

    // 상품 판매 확인
    function confirmFulfillment() external {
        require(msg.sender == market, 'e024');
        require(ContractState == ContractStateChoices.ACTIVE, 'e013');
        ContractState = ContractStateChoices.FULFILLED;
        emit FulfillmentConfirmed(msg.sender);
    }

    // 상품 수령 완료
    function confirmProductUsed() external {
        require(msg.sender == receiver, 'e020'); 
        require(ContractState == ContractStateChoices.FULFILLED, 'e021');
        ContractState = ContractStateChoices.PRODUCT_USED;
        emit ProductUsedConfirmed(msg.sender);
        distributeFunds(); 
    }

    // 판매 대금 정산
    function distributeFunds() private {
        require(ContractState == ContractStateChoices.PRODUCT_USED, 'e022');
        uint256 marketShare = contractPrice / 10; 
        uint256 sellerShare = contractPrice - marketShare; 
        payable(market).transfer(marketShare);
        payable(seller).transfer(sellerShare);
        emit FundsDistributed(market, marketShare, seller, sellerShare);
        ContractState = ContractStateChoices.EXECUTED;
    }

    // 컨트랙트 상태 조회
    function escrowStatus() external view returns(ContractStateChoices) {
        return ContractState;
    }

    
}
