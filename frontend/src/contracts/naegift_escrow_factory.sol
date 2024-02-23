// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./naegift_escrow.sol";

contract NaegiftEscrowFactory {
    mapping(address => bool) private escrowList;

    event EscrowCreated(address escrowAddress);
    

    function createEscrow(
        address _buyer, 
        address _seller, 
        address _receiver, 
        address _market, 
        uint256 _contractPrice) public {
        naegift_escrow newEscrow = new naegift_escrow();
        newEscrow.initialize(
        _buyer,
        _seller, 
        _receiver, 
        _market, 
        _contractPrice);
        address newEscrowAddress = address(newEscrow);
        escrowList[newEscrowAddress] = true;
        emit EscrowCreated(newEscrowAddress);      
    }

    function existEscrow(address escrowAddress) public view returns(bool){
        return escrowList[escrowAddress];
    }
}