// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PushCommStorageV2 {
    /**
     * @notice 특정 사용자에 대한 중요한 세부 정보를 포함하는 사용자 구조체입니다.
     **/
    struct User {
        // @notice 사용자가 활성 상태인지 여부를 나타냅니다.
        bool userActivated;
        // @notice 공개 키가 발행될 때까지 false입니다.
        bool publicKeyRegistered;
        // @notice 이 블록 이전에는 이벤트를 폴링해서는 안 됩니다. 사용자가 존재하지 않기 때문입니다.
        uint256 userStartBlock;
        // @notice 구독자 추적
        uint256 subscribedCount;
        /**
         * 특정 채널 주소에 대해 사용자가 구독했는지 여부를 나타냅니다.
         * 1 -> 사용자가 구독함
         * 0 -> 사용자가 구독하지 않음
         **/
        mapping(address => uint8) isSubscribed;
        // 모든 구독된 채널 추적
        mapping(address => uint256) subscribed;
        mapping(uint256 => address) mapAddressSubscribed;
    }

    /** 매핑 **/
    mapping(address => User) public users;
    mapping(address => uint256) public nonces;
    mapping(uint256 => address) public mapAddressUsers;
    mapping(address => mapping(address => string)) public userToChannelNotifs;
    mapping(address => mapping(address => bool))
        public delegatedNotificationSenders;

    /** 상태 변수 **/
    address public governance;
    address public pushChannelAdmin;
    uint256 public chainID;
    uint256 public usersCount;
    bool public isMigrationComplete;
    address public EPNSCoreAddress;
    string public chainName;
    string public constant name = "EPNS COMM V1";
    bytes32 public constant NAME_HASH = keccak256(bytes(name));
    bytes32 public constant DOMAIN_TYPEHASH =
        keccak256(
            "EIP712Domain(string name,uint256 chainId,address verifyingContract)"
        );
    bytes32 public constant SUBSCRIBE_TYPEHASH =
        keccak256(
            "Subscribe(address channel,address subscriber,uint256 nonce,uint256 expiry)"
        );
    bytes32 public constant UNSUBSCRIBE_TYPEHASH =
        keccak256(
            "Unsubscribe(address channel,address subscriber,uint256 nonce,uint256 expiry)"
        );
    bytes32 public constant SEND_NOTIFICATION_TYPEHASH =
        keccak256(
            "SendNotification(address channel,address recipient,bytes identity,uint256 nonce,uint256 expiry)"
        );
    // 새로운 상태 변수
    address public PUSH_TOKEN_ADDRESS;

    struct ChatDetails {
        address requestSender;
        uint256 timestamp;
        uint256 amountDeposited;
    }

    mapping(address => ChatDetails) public userChatData;
}