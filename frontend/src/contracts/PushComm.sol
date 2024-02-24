// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;


/**
 * Push Communicator는 이름에서 알 수 있듯이, 최종 사용자와 Push Core Protocol 사이의 통신 계층입니다.
 * Communicator Protocol은 비교적 더 단순하며 프로토콜의 사용자에 관한 기본적인 세부 사항을 포함합니다.

 * Push Communicator Protocol이 허용하는 몇 가지 중요한 기능은 특정 채널 구독하기, 
 채널 구독 취소하기, 특정 수신자나 채널의 모든 구독자에게 알림 보내기 등입니다.
**/

// 필수 임포트
// import "hardhat/console.sol";
import "./PushCommStorageV2.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/proxy/Initializable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "../interfaces/IERC1271.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "../interfaces/IPushCore.sol";

contract PushCommV2 is Initializable, PushCommStorageV2 {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  /** EVENTS **/
  // 채널에서 수신자에게 알림을 보냄
  event SendNotification(
    address indexed channel,
    address indexed recipient,
    bytes identity
  );
  // 사용자 알림 설정이 추가됨
  event UserNotifcationSettingsAdded(
    address _channel,
    address _user,
    uint256 _notifID,
    string _notifSettings
  );
  // 대리인이 추가됨
  event AddDelegate(address channel, address delegate);
  // 대리인이 제거됨
  event RemoveDelegate(address channel, address delegate);
  // 사용자가 채널을 구독함
  event Subscribe(address indexed channel, address indexed user);
  // 사용자가 채널 구독을 취소함
  event Unsubscribe(address indexed channel, address indexed user);
  // 공개 키가 등록됨
  event PublicKeyRegistered(address indexed owner, bytes publickey);
  // 채널 별명이 등록됨
  event ChannelAlias(
    string _chainName,
    uint256 indexed _chainID,
    address indexed _channelOwnerAddress,
    string _ethereumChannelAddress
  );
  // 채팅 요청이 시작됨
  event IncentivizeChatReqInitiated(
    address requestSender,
    address requestReceiver,
    uint256 amountDeposited,
    uint256 timestamp
  );

  /** MODIFIERS **/
  // pushChannelAdmin만 실행할 수 있음
  modifier onlyPushChannelAdmin() {
    require(
      msg.sender == pushChannelAdmin,
      "PushCommV2::onlyPushChannelAdmin: 사용자가 pushChannelAdmin이 아닙니다."
    );
    _;
  }

  // PushCore만 실행할 수 있음
  modifier onlyPushCore() {
    require(
      msg.sender == EPNSCoreAddress,
      "PushCommV2::onlyPushCore: 호출자가 PushCore가 아닙니다."
    );
    _;
  }

  /* ***************

        INITIALIZER
        프로젝트 초기화

    *************** */
    // 계약을 초기화하고 사용자를 마켓 채널에 구독시킴
    function initialize(
      address _user,
      address _pushChannelAdmin,
      address public marketChannel,
      string memory _chainName
    ) public initializer returns (bool) {
      pushChannelAdmin = _pushChannelAdmin;
      governance = _pushChannelAdmin;
      chainName = _chainName;
      chainID = getChainId();
      _subscribe(marketChannel, _user); // marketChannel은 마켓 채널의 주소입니다.
      return true;
    }

    // 사용자가 로그인 상태인지 확인
    function isUserLoggedIn(address _user) public view returns (bool) {
      return users[_user].userActivated;
    }

    // 판매자에게 알림을 보냄
    function sendNotificationToSeller(address _seller, bytes memory _identity) external {
      require(isUserLoggedIn(_seller), "사용자가 로그인 상태가 아니거나 존재하지 않습니다.");
      _sendNotification(marketChannel, _seller, _identity);
    }

    // 마켓 채널을 설정함
    function setMarketChannel(address _marketChannel) external onlyPushChannelAdmin {
  marketChannel = _marketChannel;
}

/****************

    => 설정 함수 <=

    ****************/
  // 채널 별명을 검증하고 이벤트를 발생시키는 함수
  function verifyChannelAlias(string memory _channelAddress) external {
    emit ChannelAlias(chainName, chainID, msg.sender, _channelAddress);
  }

  // 마이그레이션 완료를 표시하는 함수
  function completeMigration() external onlyPushChannelAdmin {
    isMigrationComplete = true;
  }

  // EPNS 코어 주소를 설정하는 함수
  function setEPNSCoreAddress(
    address _coreAddress
  ) external onlyPushChannelAdmin {
    EPNSCoreAddress = _coreAddress;
  }

  // 거버넌스 주소를 설정하는 함수
  function setGovernanceAddress(
    address _governanceAddress
  ) external onlyPushChannelAdmin {
    governance = _governanceAddress;
  }

  // 푸시 채널 관리자 권한을 이전하는 함수
  function transferPushChannelAdminControl(
    address _newAdmin
  ) external onlyPushChannelAdmin {
    require(
      _newAdmin != address(0),
      "PushCommV2::transferPushChannelAdminControl: Invalid Address"
    );
    require(
      _newAdmin != pushChannelAdmin,
      "PushCommV2::transferPushChannelAdminControl: Admin address is same"
    );
    pushChannelAdmin = _newAdmin;
  }

  /****************

    => 구독 기능 <=

    ****************/

  // 사용자가 특정 채널을 구독하고 있는지 확인하는 함수
  function isUserSubscribed(
    address _channel,
    address _user
  ) public view returns (bool) {
    User storage user = users[_user];
    if (user.isSubscribed[_channel] == 1) {
      return true;
    }
  }

  // 사용자가 특정 채널을 구독하는 함수
  function subscribe(address _channel) external returns (bool) {
    _subscribe(_channel, msg.sender);
    return true;
  }

  // 사용자가 여러 채널을 한 번에 구독할 수 있게 하는 함수
  function batchSubscribe(
    address[] calldata _channelList
  ) external returns (bool) {
    for (uint256 i = 0; i < _channelList.length; i++) {
      _subscribe(_channelList[i], msg.sender);
    }
    return true;
  }

  // 구독 데이터를 새 프로토콜로 마이그레이션하는 함수
  function migrateSubscribeData(
    uint256 _startIndex,
    uint256 _endIndex,
    address[] calldata _channelList,
    address[] calldata _usersList
  ) external onlyPushChannelAdmin returns (bool) {
    require(
      !isMigrationComplete,
      "PushCommV2::migrateSubscribeData: Migration of Subscribe Data is Complete Already"
    );
    require(
      _channelList.length == _usersList.length,
      "PushCommV2::migrateSubscribeData: Unequal Arrays passed as Argument"
    );

    for (uint256 i = _startIndex; i < _endIndex; i++) {
      if (isUserSubscribed(_channelList[i], _usersList[i])) {
        continue;
      } else {
        _subscribe(_channelList[i], _usersList[i]);
      }
    }
    return true;
  }

  function migrateSubscribeData(
    uint256 _startIndex,
    uint256 _endIndex,
    address[] calldata _channelList,
    address[] calldata _usersList
  ) external onlyPushChannelAdmin returns (bool) {
    require(
      !isMigrationComplete,
      "PushCommV2::migrateSubscribeData: 구독 데이터 마이그레이션이 이미 완료되었습니다."
    );
    require(
      _channelList.length == _usersList.length,
      "PushCommV2::migrateSubscribeData: 인자로 전달된 배열의 길이가 다릅니다."
    );

    for (uint256 i = _startIndex; i < _endIndex; i++) {
      if (isUserSubscribed(_channelList[i], _usersList[i])) {
        continue;
      } else {
        _subscribe(_channelList[i], _usersList[i]);
      }
    }
    return true;
  }

  /**
   * @notice 사용자가 특정 채널을 구독하게 하는 기본 함수
   *
   * @dev 채널 구독에 대한 중요한 정보로 사용자 구조체를 초기화합니다.
   *      호출자를 프로토콜의 활성화된 사용자로 추가합니다. (사용자가 이미 추가되지 않은 경우에만)
   *
   * @param _channel 사용자가 구독하는 채널의 주소
   * @param _user 구독자의 주소
   **/
  function _subscribe(address _channel, address _user) private {
    if (!isUserSubscribed(_channel, _user)) {
      _addUser(_user);

      User storage user = users[_user];

      uint256 _subscribedCount = user.subscribedCount;

      user.isSubscribed[_channel] = 1;
      // 카운트를 인덱스로 취급하고 사용자 구조체를 업데이트합니다.
      user.subscribed[_channel] = _subscribedCount;
      user.mapAddressSubscribed[_subscribedCount] = _channel;
      user.subscribedCount = _subscribedCount.add(1); // 마지막으로 구독 카운트를 증가시킵니다.
      // 이벤트 발생
      emit Subscribe(_channel, _user);
    }
  }

  /**
   * @notice 메타 트랜잭션을 통한 구독 함수
   * @dev 사용자의 서명을 고려합니다.
   *      EIP1271 구현 포함: 계약을 위한 표준 서명 검증 방법
   **/
  function subscribeBySig(
    address channel,
    address subscriber,
    uint256 nonce,
    uint256 expiry,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external {
    // EIP-712
    require(
      subscriber != address(0),
      "PushCommV2::subscribeBySig: 유효하지 않은 서명입니다."
    );
    bytes32 domainSeparator = keccak256(
      abi.encode(DOMAIN_TYPEHASH, NAME_HASH, getChainId(), address(this))
    );
    bytes32 structHash = keccak256(
      abi.encode(SUBSCRIBE_TYPEHASH, channel, subscriber, nonce, expiry)
    );
    bytes32 digest = keccak256(
      abi.encodePacked("\x19\x01", domainSeparator, structHash)
    );

    if (Address.isContract(subscriber)) {
      // EIP-1271 사용
      bytes4 result = IERC1271(subscriber).isValidSignature(
        digest,
        abi.encodePacked(r, s, v)
      );
      require(result == 0x1626ba7e, "계약에서 유효하지 않은 서명입니다.");
    } else {
      // 계약 내에서 유효성 검증
      address signatory = ecrecover(digest, v, r, s);
      require(signatory == subscriber, "EOA에서 유효하지 않은 서명입니다.");
    }
    require(
      nonce == nonces[subscriber]++,
      "PushCommV2::subscribeBySig: 유효하지 않은 nonce입니다."
    );
    require(now <= expiry,     "PushCommV2::subscribeBySig: 서명이 만료되었습니다.");

    _subscribe(channel, subscriber);
  }

  /**
   * @notice 사용자가 자신의 채널을 생성할 때 PushCore 계약이 기본 구독 함수를 호출하도록 허용합니다.
   *         이는 채널 소유자가 중요한 Push 채널뿐만 아니라 자신의 채널에도 구독되도록 합니다.
   *
   * @dev PushCore에 의해서만 호출 가능합니다. 이는 사용자가 자신의 주소에 대해서만 구독할 수 있도록 하기 위함입니다.
   *      메인 구독 함수의 호출자는 사용자 자신(자신의 주소에 대해) 또는 PushCore 계약이어야 합니다.
   *
   * @param _channel 사용자가 구독하는 채널의 주소
   * @param _user 채널의 구독자 주소
   **/
  function subscribeViaCore(
    address _channel,
    address _user
  ) external onlyPushCore returns (bool) {
    _subscribe(_channel, _user);
    return true;
  }

  /****************

    => USUBSCRIBE FUNCTIOANLTIES <=

    ****************/

  /**
   * @notice 사용자가 직접 특정 채널에서 구독 취소를 할 수 있는 외부 구독 취소 함수
   *
   * @dev 특정 채널에서 함수 호출자의 구독을 취소합니다.
   *      "msg.sender"를 고려합니다.
   *
   * @param _channel 사용자가 구독 취소하는 채널의 주소
   **/
  function unsubscribe(address _channel) external returns (bool) {
    // 실제 구독 취소 호출
    _unsubscribe(_channel, msg.sender);
    return true;
  }

  /**
   * @notice 사용자가 한 번에 여러 채널에서 구독 취소를 할 수 있게 합니다.
   *
   * @param _channelList 사용자가 구독 취소를 원하는 채널들의 주소 배열
   **/
  function batchUnsubscribe(
    address[] calldata _channelList
  ) external returns (bool) {
    for (uint256 i = 0; i < _channelList.length; i++) {
      _unsubscribe(_channelList[i], msg.sender);
    }
    return true;
  }

  /**
   * @notice 사용자가 특정 채널에서 구독 취소를 할 수 있는 기본 구독 취소 함수
   * @dev 채널 구독 취소에 대한 중요한 정보로 사용자 구조체를 수정합니다.
   * @param _channel 구독 취소하는 채널의 주소
   * @param _user 구독 취소자의 주소
   **/
  function _unsubscribe(address _channel, address _user) private {
    if (isUserSubscribed(_channel, _user)) {
      User storage user = users[_user];

      uint256 _subscribedCount = user.subscribedCount - 1;

      user.isSubscribed[_channel] = 0;
      user.subscribed[user.mapAddressSubscribed[_subscribedCount]] = user
        .subscribed[_channel];
      user.mapAddressSubscribed[user.subscribed[_channel]] = user
        .mapAddressSubscribed[_subscribedCount];

      // 마지막 것을 삭제하고 차감
      delete (user.subscribed[_channel]);
      delete (user.mapAddressSubscribed[_subscribedCount]);
      user.subscribedCount = _subscribedCount;

      // 이벤트 발생
      emit Unsubscribe(_channel, _user);
    }
  }

  /**
   * @notice 메타 트랜잭션을 통한 구독 취소 함수
   * @dev 트랜잭션 서명자를 고려합니다.
   *      EIP1271 구현 포함: 계약을 위한 표준 서명 검증 방법
   **/
  function unsubscribeBySig(
    address channel,
    address subscriber,
    uint256 nonce,
    uint256 expiry,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external {
    require(
      subscriber != address(0),
      "PushCommV2::unsubscribeBySig: 유효하지 않은 서명입니다."
    );
    // EIP-712
    bytes32 domainSeparator = keccak256(
      abi.encode(DOMAIN_TYPEHASH, NAME_HASH, getChainId(), address(this))
    );
    bytes32 structHash = keccak256(
      abi.encode(UNSUBSCRIBE_TYPEHASH, channel, subscriber, nonce, expiry)
    );
    bytes32 digest = keccak256(
      abi.encodePacked("\x19\x01", domainSeparator, structHash)
    );

    if (Address.isContract(subscriber)) {
      // EIP-1271 사용
      bytes4 result = IERC1271(subscriber).isValidSignature(
        digest,
        abi.encodePacked(r, s, v)
      );
      require(result == 0x1626ba7e, "계약에서 유효하지 않은 서명입니다.");
    } else {
      // 계약 내에서 유효성 검증
      address signatory = ecrecover(digest, v, r, s);
      require(signatory == subscriber, "EOA에서 유효하지 않은 서명입니다.");
    }
    require(
      nonce == nonces[subscriber]++,
      "PushCommV2::unsubscribeBySig: 유효하지 않은 nonce입니다."
    );
    require(now <= expiry, "PushCommV2::unsubscribeBySig: 서명이 만료되었습니다.");
    _unsubscribe(channel, subscriber);
  }

  /**
   * @notice 사용자가 자신의 시간 제한 채널을 파괴할 때 PushCore 계약이 기본 구독 취소 함수를 호출할 수 있게 합니다.
   *         이는 채널 소유자가 중요한 Push 채널뿐만 아니라 자신의 채널에서도 구독 취소되도록 합니다.
   *         참고-채널을 파괴하기 전에 구독 취소를 하지 않으면, 동일한 지갑 주소를 사용하여 다시 채널을 생성할 수 없습니다.
   *
   * @dev    PushCore에 의해서만 호출 가능합니다.
   * @param _channel 구독 취소되는 채널의 주소
   * @param _user 채널의 구독 취소자 주소
   **/
  function unSubscribeViaCore(
    address _channel,
    address _user
  ) external onlyPushCore returns (bool) {
    _unsubscribe(_channel, _user);
    return true;
  }
  /* **************

    => 공개 키 방송 및 사용자 추가 기능 <=

    *************** */

  /**
   * @notice 특정 사용자의 주소를 프로토콜에 활성화/추가합니다.
   *         총 사용자 수를 추적합니다.
   * @dev   사용자가 아직 활성화되지 않았을 경우에만 주요 작업을 실행합니다.
   *        주소가 이미 추가된 경우 아무 작업도 수행하지 않습니다.
   *
   * @param _user 사용자의 주소
   * @return userAlreadyAdded 사용자가 이미 추가되었는지 여부를 반환합니다.
   **/
  function _addUser(address _user) private returns (bool userAlreadyAdded) {
    if (users[_user].userActivated) {
      userAlreadyAdded = true;
    } else {
      // 사용자를 활성화합니다
      users[_user].userStartBlock = block.number;
      users[_user].userActivated = true;
      mapAddressUsers[usersCount] = _user;

      usersCount = usersCount.add(1);
    }
  }

  /* @dev 공개 키 방송을 처리하는 내부 시스템,
   *     구독하거나 채널을 생성하는 진입점이지만 선택 사항입니다.
   */
  function _broadcastPublicKey(
    address _userAddr,
    bytes memory _publicKey
  ) private {
    // 이미 추가된 경우 아무 작업도 수행하지 않지만, 방송 전에 사용자를 추가하는 것이 필요합니다
    _addUser(_userAddr);

    // 공개 키에서 주소를 가져옵니다
    address userAddr = getWalletFromPublicKey(_publicKey);

    if (_userAddr == userAddr) {
      // 검증이 성공할 때만 변경하고, 그렇지 않으면 채널이 그룹 메시지를 보내고 싶어한다고 가정합니다
      users[userAddr].publicKeyRegistered = true;

      // 이벤트를 발생시킵니다
      emit PublicKeyRegistered(userAddr, _publicKey);
    } else {
      revert("Public Key Validation Failed");
    }
  }

  /// @dev 0x를 추가하는 것을 잊지 마세요
  function getWalletFromPublicKey(
    bytes memory _publicKey
  ) public pure returns (address wallet) {
    if (_publicKey.length == 64) {
      wallet = address(uint160(uint256(keccak256(_publicKey))));
    } else {
      wallet = 0x0000000000000000000000000000000000000000;
    }
  }

  /// @dev 사용자가 직접 자신의 공개 키를 방송하는 행위
  function broadcastUserPublicKey(bytes calldata _publicKey) external {
    // 가스를 절약합니다
    if (users[msg.sender].publicKeyRegistered) {
      // 할 일이 없습니다, 사용자가 이미 등록되었습니다
      return;
    }

    // 방송합니다
    _broadcastPublicKey(msg.sender, _publicKey);
  }

  /* **************

    => 알림 전송 기능 <=

    *************** */

  /**
   * @notice 채널 소유자가 알림 전송을 위한 대리인을 추가할 수 있습니다.
   *         대리인은 채널을 대신하여 알림을 전송할 수 있습니다.
   * @dev    이 함수는 채널 소유자만 PushCore 계약에서 호출할 수 있습니다.
   * NOTE:   채널 주소가 실제로 채널의 소유자인지 여부는 PUSH NODES를 통해 검증됩니다.
   *
   * @param _delegate 알림 전송이 허용된 대리인의 주소
   **/
  function addDelegate(address _delegate) external {
    delegatedNotificationSenders[msg.sender][_delegate] = true;
    emit AddDelegate(msg.sender, _delegate);
  }

  /**
     /**
   * @notice 채널 소유자가 대리인의 알림 전송 권한을 제거할 수 있습니다.
   * @dev    이 함수는 채널 소유자만 PushCore 계약에서 호출할 수 있습니다.
   * NOTE:   채널 주소가 실제로 채널의 소유자인지 여부는 PUSH NODES를 통해 검증됩니다.
   * @param _delegate 알림 전송이 허용된 대리인의 주소
   **/
  function removeDelegate(address _delegate) external {
    delegatedNotificationSenders[msg.sender][_delegate] = false;
    emit RemoveDelegate(msg.sender, _delegate);
  }

  /***
      세 가지 주요 호출자:
        1. 채널 소유자가 모든 구독자 / 구독자의 부분 집합 / 개별 구독자에게 알림을 보냅니다.
        2. 채널의 대리인이 수신자에게 알림을 보냅니다.

    <---------------------------------------------------------------------------------------------->
     * 채널 소유자가 함수를 호출하고 알림을 보낼 때:
     *    -> "채널 소유자가 유효해야 하며" & "채널 소유자가 호출자여야 합니다"
     *    -> 주의: 주소가 채널인지 여부의 검증은 PUSH NODES를 통해 이루어집니다.
     *
     * 대리인이 수신자에게 알림을 보내고자 할 때:
     *   -> "대리인이 호출자여야 하며" & "대리인이 채널 소유자에 의해 승인되어야 합니다"
    **/

  function _checkNotifReq(
    address _channel,
    address _recipient
  ) private view returns (bool) {
    // 알림을 보낼 수 있는지 확인
    if (
      (_channel == 0x0000000000000000000000000000000000000000 &&
        msg.sender == pushChannelAdmin) ||
      (_channel == msg.sender) ||
      (delegatedNotificationSenders[_channel][msg.sender])
    ) {
      return true;
    }

    return false;
  }

  /**
   * @notice 채널 소유자, 대리인 및 사용자가 알림을 보낼 수 있습니다.
   * @dev 모든 요구 사항이 충족되면 알림 세부 정보를 발행합니다.
   * @param _channel 채널의 주소
   * @param _recipient 알림의 수신자 주소
   * @param _identity 알림에 대한 정보
   **/
  function sendNotification(
    address _channel,
    address _recipient,
    bytes memory _identity
  ) external returns (bool) {
    // 알림 전송 시도 및 성공 여부 반환
    bool success = _checkNotifReq(_channel, _recipient);
    if (success) {
      // 알림 발행
      emit SendNotification(_channel, _recipient, _identity);
      return true;
    }

    return false;
  }

  /**
   * @notice 채널 소유자, 대리인 및 사용자가 알림을 보낼 수 있는 기본 알림 함수입니다.
   *
   * @dev EIP 712 send notif 함수를 통해 호출되도록 특별히 설계되었습니다.
   *      모든 중요한 검사를 수행하기 위해 서명자 주소를 고려합니다.
   *
   * @param _channel 채널의 주소
   * @param _recipient 알림의 수신자 주소
   * @param _signatory Send Notif 함수 호출 트랜잭션의 서명자 주소
   * @param _identity 알림에 대한 정보
   **/
  function _sendNotification(
    address _channel,
    address _recipient,
    address _signatory,
    bytes calldata _identity
  ) private returns (bool) {
    // 알림 전송 권한 확인 및 알림 발행
    if (
      _channel == _signatory ||
      delegatedNotificationSenders[_channel][_signatory] ||
      _recipient == _signatory
    ) {
      emit SendNotification(_channel, _recipient, _identity);
      return true;
    }

    return false;
  }

  /**
   * @notice 메타 트랜잭션 기능을 사용하여 알림을 보냅니다.
   * @dev 호출자가 트랜잭션에 서명하기만```solidity
/***
      세 가지 주요 호출자:
        1. 채널 소유자가 모든 구독자 / 구독자의 부분 집합 / 개별 구독자에게 알림을 보냅니다.
        2. 채널의 대리인이 수신자에게 알림을 보냅니다.

    <---------------------------------------------------------------------------------------------->
     * 채널 소유자가 함수를 호출하고 알림을 보낼 때:
     *    -> "채널 소유자가 유효해야 하며" & "채널 소유자가 호출자여야 합니다"
     *    -> 주의: 주소가 채널인지 여부의 검증은 PUSH NODES를 통해 이루어집니다.
     *
     * 대리인이 수신자에게 알림을 보내고자 할 때:
     *   -> "대리인이 호출자여야 하며" & "대리인이 채널 소유자에 의해 승인되어야 합니다"
    **/

  function _checkNotifReq(
    address _channel,
    address _recipient
  ) private view returns (bool) {
    // 알림 요청을 검증하는 함수
    if (
      (_channel == 0x0000000000000000000000000000000000000000 &&
        msg.sender == pushChannelAdmin) ||
      (_channel == msg.sender) ||
      (delegatedNotificationSenders[_channel][msg.sender])
    ) {
      return true;
    }

    return false;
  }

  /**
   * @notice 채널 소유자, 대리인 및 사용자가 알림을 보낼 수 있습니다.
   * @dev 모든 요구사항이 충족되면 알림 세부 정보를 발행합니다.
   * @param _channel 채널의 주소
   * @param _recipient 알림의 수신자 주소
   * @param _identity 알림에 대한 정보
   **/
  function sendNotification(
    address _channel,
    address _recipient,
    bytes memory _identity
  ) external returns (bool) {
    // 알림을 보내는 함수
    bool success = _checkNotifReq(_channel, _recipient);
    if (success) {
      // 메시지 발행
      emit SendNotification(_channel, _recipient, _identity);
      return true;
    }

    return false;
  }

  /**
   * @notice 채널 소유자, 대리인 및 사용자가 알림을 보낼 수 있는 기본 알림 함수
   *
   * @dev EIP 712 send notif 함수를 통해 호출되도록 특별히 설계되었습니다.
   *      모든 중요한 검사를 수행하기 위해 서명자 주소를 고려합니다.
   *
   * @param _channel 채널의 주소
   * @param _recipient 알림의 수신자 주소
   * @param _signatory Send Notif 함수 호출 트랜잭션의 서명자 주소
   * @param _identity 알림에 대한 정보
   **/
  function _sendNotification(
    address _channel,
    address _recipient,
    address _signatory,
    bytes calldata _identity
  ) private returns (bool) {
    // 알림을 보내는 내부 함수
    if (
      _channel == _signatory ||
      delegatedNotificationSenders[_channel][_signatory] ||
      _recipient == _signatory
    ) {
      // 메시지 발행
      emit SendNotification(_channel, _recipient, _identity);
      return true;
    }

    return false;
  }

  /**
   * @notice 알림을 보내기 위한 메타 트랜잭션 함수
   * @dev 호출자가 트랜잭션에 서명하기만 하면   Send Notif 함수를 시작할 수 있습니다.
  EIP1271 구현을 포함합니다: 계약을 위한 표준 서명 검증 방법
  @return bool 알림 전송 자격이 성공적인지 여부를 반환합니다.
  **/

  /**
   * @notice 사용자가 특정 채널에 대한 알림 설정을 생성하고 구독할 수 있게 합니다.
   * @dev 사용자와 채널 알림 설정 매핑을 업데이트하여 특정 채널에 대한 사용자의 알림 설정을 추적합니다.
   * @param _channel 사용자가 알림 설정을 생성하는 채널의 주소
   * @param _notifID 사용자가 선택한 옵션의 십진수 표현
   * @param _notifSettings 사용자의 알림 설정을 나타내는 구분된 문자열
   **/
  function changeUserChannelSettings(
    address _channel,
    uint256 _notifID,
    string calldata _notifSettings
  ) external {
    // 사용자가 구독한 채널에 대한 알림 설정을 변경하는 함수
    require(
      isUserSubscribed(_channel, msg.sender),
      "PushCommV2::changeUserChannelSettings: User not Subscribed to Channel"
    );
    string memory notifSetting = string(
      abi.encodePacked(Strings.toString(_notifID), "+", _notifSettings)
    );
    userToChannelNotifs[msg.sender][_channel] = notifSetting;
    emit UserNotifcationSettingsAdded(
      _channel,
      msg.sender,
      _notifID,
      notifSetting
    );
  }

  // 현재 체인의 ID를 반환하는 함수
  function getChainId() internal pure returns (uint256) {
    uint256 chainId;
    assembly {
      chainId := chainid()
    }
    return chainId;
  }

  // PUSH 토큰 주소를 설정하는 함수
  function setPushTokenAddress(
    address _tokenAddress
  ) external onlyPushChannelAdmin {
    PUSH_TOKEN_ADDRESS = _tokenAddress;
  }

  // 채팅 요청을 위한 인센티브를 생성하는 함수
  function createIncentivizeChatRequest(
    address requestReceiver,
    uint256 amount
  ) external {
    // 요청을 시작하기 위한 입금 없이는 요청을 시작할 수 없음
    require(amount > 0, "Request cannot be initiated without deposit");
    address requestSender = msg.sender;
    address coreContract = EPNSCoreAddress;
    // 들어오는 PUSH 토큰을 코어 계약으로 전송
    IERC20(PUSH_TOKEN_ADDRESS).safeTransferFrom(
      requestSender,
      coreContract,
      amount
    );

    ChatDetails storage chatData = userChatData[requestSender];
    if (chatData.amountDeposited == 0) {
      chatData.requestSender = requestSender;
    }
    chatData.timestamp = block.timestamp;
    chatData.amountDeposited += amount;

    // 코어에서 직접 chat 요청 데이터를 처리하도록 트리거
    IPushCore(coreContract).handleChatRequestData(
      requestSender,
      requestReceiver,
      amount
    );

    // 채팅 요청 인센티브 시작 이벤트 발행
    emit IncentivizeChatReqInitiated(
      requestSender,
      requestReceiver,
      amount,
      block.timestamp
    );
  }
}
  
