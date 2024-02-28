// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";

contract MetaTransaction {
    address payable public marketAddress;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Invalid caller");
        _;
    }

    function setMarketAddress(address payable _marketAddress) public onlyOwner {
        marketAddress = _marketAddress;
    }

    function checkGas() public view returns (uint256) {
        return gasleft();
    }

    receive() external payable {}

    function processBatchTransactions(address[] memory users, bytes[] memory signatures, string[] memory messages) public payable {

        require(msg.sender == marketAddress, "Invalid caller");
        require(users.length == signatures.length && users.length == messages.length, "Invalid input");
        require(users.length <= 50, "Batch size too large");

        for (uint i = 0; i < users.length; i++) {
            signTransaction(users[i], messages[i], signatures[i]);
            emit Event03(users[i]);
        }
    }

    function signTransaction(
        address user,
        string memory _msg,
        bytes memory signature
    ) public {
        bytes32 ethSign = getEthSignMsgHash(_msg);
        (bytes32 r, bytes32 s, uint8 v) = splitSign(signature);
        require(user == ecrecover(ethSign, v, r, s), "Invalid signature");
    }

    function getEthSignMsgHash(string memory _msg) internal pure returns (bytes32) {
        uint256 msgLength = bytes(_msg).length;
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", Strings.toString(msgLength), _msg));
    }

    function splitSign(bytes memory sign) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sign.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sign, 32))
            s := mload(add(sign, 64))
            v := byte(0, mload(add(sign, 96)))
        }
        if (v < 27) v += 27;
        require(v == 27 || v == 28, "Invalid signature version");
    }

    event Event01(address indexed from, string _msg);
    event Event02(bytes32 indexed r, bytes32 s, uint8 v);
    event Event03(address indexed account);
}