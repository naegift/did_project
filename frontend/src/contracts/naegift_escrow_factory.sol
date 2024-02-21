// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./nagift_escrow.sol";

contract NaegiftEscrowFactory {
    address[] public deployedEscrows;

    event EscrowCreated(address escrowAddress);

    function createEscrow(
        address _buyer, 
        address _seller, 
        address _receiver, 
        address _market, 
        uint256 _contractPrice) public {
        address newEscrow = address(new nagift_escrow(
            _buyer, 
            _seller, 
            _receiver, 
            _market, 
            _contractPrice));
        deployedEscrows.push(newEscrow);

        emit EscrowCreated(newEscrow);
    }

    function getDeployedEscrows() public view returns (address[] memory) {
        return deployedEscrows;
    }
}

