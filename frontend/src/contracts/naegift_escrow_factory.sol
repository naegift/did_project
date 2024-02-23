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
        uint256 _contractPrice) public returns(address) {
        address newEscrowAddress = address(new naegift_escrow(
        _buyer,
        _seller, 
        _receiver, 
        _market, 
        _contractPrice));
        escrowList[newEscrowAddress] = true;
        emit EscrowCreated(newEscrowAddress);  
        return newEscrowAddress;    
    }

    function existEscrow(address escrowAddress) public view returns(bool){
        return escrowList[escrowAddress];
    }
}