// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NaegiftEscrow {
    enum ContractStateChoices {
        ACTIVE,
        FULFILLED,
        EXECUTED
    }

    struct EscrowData {
        address buyer;
        address seller;
        address receiver;
        address market;
        uint256 contractPrice;
        ContractStateChoices state;
    }

    mapping(string => EscrowData) public escrows;

    event EscrowCreated(string uuid);
    event FulfillmentConfirmed(string uuid, address indexed market);
    event ProductUsedConfirmed(string uuid, address indexed receiver);
    event FundsDistributed(string uuid, address indexed market, uint256 marketShare, address indexed seller, uint256 sellerShare);

    function createEscrow(
        string memory uuid,
        address _buyer,
        address _seller,
        address _receiver,
        address _market,
        uint256 _contractPrice
    ) public payable {
        require(msg.value >= _contractPrice, "e002");
        require(msg.sender == _buyer, "e003");
        require(escrows[uuid].buyer == address(0), "Escrow already exists");

        escrows[uuid] = EscrowData({
            buyer: _buyer,
            seller: _seller,
            receiver: _receiver,
            market: _market,
            contractPrice: _contractPrice,
            state: ContractStateChoices.ACTIVE
        });

        emit EscrowCreated(uuid);
    }

    function confirmFulfillment(string memory uuid) external {
        require(msg.sender == escrows[uuid].market, "e024");
        require(escrows[uuid].state == ContractStateChoices.ACTIVE, "e013");
        escrows[uuid].state = ContractStateChoices.FULFILLED;
        emit FulfillmentConfirmed(uuid, escrows[uuid].receiver);
    }

    function confirmProductUsed(string memory uuid) external {
        require(msg.sender == escrows[uuid].market, "e020");
        require(escrows[uuid].state == ContractStateChoices.FULFILLED, "e021");
        escrows[uuid].state = ContractStateChoices.EXECUTED;
        emit ProductUsedConfirmed(uuid, escrows[uuid].market);
        distributeFunds(uuid);
    }

    function distributeFunds(string memory uuid) private {
        require(escrows[uuid].state == ContractStateChoices.EXECUTED, "e022");
        EscrowData storage escrow = escrows[uuid];
        uint256 marketShare = escrow.contractPrice / 10;
        uint256 sellerShare = escrow.contractPrice - marketShare;
        payable(escrow.market).transfer(marketShare);
        payable(escrow.seller).transfer(sellerShare);
        emit FundsDistributed(uuid, escrow.market, marketShare, escrow.seller, sellerShare);
    }

    function escrowStatus(string memory uuid) external view returns(ContractStateChoices) {
        return escrows[uuid].state;
    }

    receive() external payable {}
}