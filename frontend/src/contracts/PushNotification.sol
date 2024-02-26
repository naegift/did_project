// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IPUSHNotiInterface.sol";

contract PushNotificationSender {
  address private constant EPNS_COMM_CONTRACT =
    0x0C34d54a09CFe75BCcd878A469206Ae77E0fe6e7;
  address private constant YOUR_CHANNEL_ADDRESS =
    0xb2B7Cf04a31d943fBf14ea4575112D9b3Aa2d3e3;
  function sendPushNotification(
    address recipient,
    string memory title,
    string memory body
  ) public onlyOwner {
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
