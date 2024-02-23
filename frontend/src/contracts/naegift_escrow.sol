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
    ContractStateChoices public ContractState;

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
        require(msg.sender == _buyer || 
        msg.sender == _seller || 
        msg.sender == _receiver, 'e003');
        require(_contractPrice > 0, 'e006');
        contractPrice = _contractPrice;
        buyer = _buyer;
        seller = _seller;
        receiver = _receiver;
        market = _market;
        ContractState = ContractStateChoices.DEPLOYED;
    }

    // 입금 확인
    function confirmDeposit() external payable {
        require(msg.sender == buyer, "e003");
        require(ContractState == ContractStateChoices.DEPLOYED, 'e013');
        require(address(this).balance >= contractPrice, 'e002');
        ContractState = ContractStateChoices.ACTIVE;
    }

    // 상품 판매 확인
    function confirmFulfillment() external {
        require(msg.sender == market, 'e024');
        require(ContractState == ContractStateChoices.ACTIVE, 'e013');
        ContractState = ContractStateChoices.FULFILLED;
    }

    // 상품 수령 확인
    function confirmProductUsed() external {
        require(msg.sender == receiver, 'e020'); 
        require(ContractState == ContractStateChoices.FULFILLED, 'e021');
        ContractState = ContractStateChoices.PRODUCT_USED;
        distributeFunds(); 
    }

    // 판매 대금 정산
    function distributeFunds() private {
        require(ContractState == ContractStateChoices.PRODUCT_USED, 'e022');
        uint256 marketShare = contractPrice / 10; 
        uint256 sellerShare = contractPrice - marketShare; 
        payable(market).transfer(marketShare);
        payable(seller).transfer(sellerShare);
        ContractState = ContractStateChoices.EXECUTED;
    }

    // 환불요청 이후 자금반환
    // function confirmReturn() external {
    //     require(msg.sender == market, 'e003');
    //     require(ContractState == ContractStateChoices.FULFILLED, "e026"); 
    //     uint256 depositBalance = address(this).balance;
    //     payable(buyer).transfer(depositBalance);
    //     ContractState = ContractStateChoices.DEPLOYED;
    // }

    // 컨트랙트 상태 조회
    function escrowStatus() external view returns(ContractStateChoices) {
        return ContractState;
    }

    
}
