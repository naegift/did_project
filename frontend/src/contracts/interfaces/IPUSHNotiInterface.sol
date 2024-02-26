// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPUSHCommInterface {
    function sendNotification(address channel, address recipient, bytes memory identity) external;
}