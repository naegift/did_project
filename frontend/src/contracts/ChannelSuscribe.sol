pragma solidity ^0.8.20;

contract ChannelSubscription {
    using ECDSA for bytes32;

    mapping(address => bool) public isSubscribed;

    event Subscribed(address indexed user, address indexed channel);

    function subscribeThroughMetaTx(
        address user,
        address channel,
        uint256 expiry,
        bytes calldata signature
    ) external {
        require(!isSubscribed[user], "User already subscribed");

        bytes32 messageHash = keccak256(abi.encodePacked(user, channel, expiry));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        require(ethSignedMessageHash.recover(signature) == user, "Invalid signature");

        isSubscribed[user] = true;

        emit Subscribed(user, channel);
    }
}