// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPUSHNotiInterface {
  function sendNotification(
    address _channel,
    address _recipient,
    bytes calldata _identity
  ) external;
}
