// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IPUSHNotiInterface.sol";

// Ownable을 상속받도록 수정
contract PushNotificationSender{
  address private constant EPNS_COMM_CONTRACT =
    0x0C34d54a09CFe75BCcd878A469206Ae77E0fe6e7;
  address private constant YOUR_CHANNEL_ADDRESS =
    0x3C51F308502c5fde8c7C1Fa39d35aA621838F7DF;

  function sendPushNotification(
    address recipient,
    string memory title,
    string memory body
  ) public {
    bytes memory identity = abi.encodePacked(
      "0", // (신원유형) 0: 일반, 1: IPFS, 2: Payload 3: 서브 그래프
      "+", // 구분자
      "3", // (채널유형) 1: 전체 주소, 1: 특정 단일 주소, 2: 하위 그룹
      "+", // 구분자
      title, // 제목
      "+", // 구분자
      body // 내용
    );

    IPUSHCommInterface(EPNS_COMM_CONTRACT).sendNotification(
      YOUR_CHANNEL_ADDRESS,
      recipient,
      identity
    );
  }
}