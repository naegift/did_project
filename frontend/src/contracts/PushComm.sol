// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/proxy/Initializable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "../interfaces/IPushCore.sol";

contract PushCommV2 is Initializable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // 이벤트 선언
    event SendNotification(address indexed channel, address indexed recipient, bytes identity);
    event Subscribe(address indexed channel, address indexed user);
    event Unsubscribe(address indexed channel, address indexed user);
    event IncentivizeChatReqInitiated(address requestSender, address requestReceiver, uint256 amount, uint256 timestamp);

    // 상태 변수 선언
    address public pushChannelAdmin;
    address public EPNSCoreAddress;
    mapping(address => bool) public usersSubscribed;

    // 초기화 함수
    function initialize(address _user, address _pushChannelAdmin, address _EPNSCoreAddress) public initializer {
        pushChannelAdmin = _pushChannelAdmin;
        EPNSCoreAddress = _EPNSCoreAddress;
        _subscribe(_user);
    }

    // 사용자 구독 함수
    function _subscribe(address _user) private {
        require(!usersSubscribed[_user], "User already subscribed");
        usersSubscribed[_user] = true;
        emit Subscribe(address(this), _user);
    }

    // 상품 사용 검증 후 알림 전송 함수
    function sendProductUsageNotification(address _seller, bytes memory _identity) external {
        require(usersSubscribed[_seller], "Seller is not subscribed");
        emit SendNotification(address(this), _seller, _identity);
    }

    // 채널 구독 취소 함수
    function unsubscribe(address _user) external {
        require(usersSubscribed[_user], "User not subscribed");
        usersSubscribed[_user] = false;
        emit Unsubscribe(address(this), _user);
    }

    // 세폴리아 테스트넷 확인 함수 (예시)
    function isSepoliaTestnet() public pure returns (bool) {
        return block.chainid == 11155111; // 세폴리아 테스트넷의 체인 ID
    }
}