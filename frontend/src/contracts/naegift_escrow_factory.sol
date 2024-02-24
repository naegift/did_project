// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./naegift_escrow.sol";

contract NaegiftEscrowFactory {
    mapping(address => bool) private escrowList;

    event EscrowCreated(address escrowAddress, string uuid);
    
    function createEscrow(
        address _buyer, 
        address _seller, 
        address _receiver, 
        address _market, 
        uint256 _contractPrice,
        string memory uuid) public payable{
        require(msg.value >= _contractPrice, 'e002');
        require(msg.sender == _buyer, 'e003');
        address newEscrowAddress = address(new naegift_escrow(
        _buyer,
        _seller, 
        _receiver, 
        _market, 
        _contractPrice));
        escrowList[newEscrowAddress] = true;
        payable(newEscrowAddress).transfer(msg.value);
        emit EscrowCreated(newEscrowAddress, uuid);  
    }

    function existEscrow(address escrowAddress) public view returns(bool){
        return escrowList[escrowAddress];
    }
}