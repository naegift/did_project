// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./SoonToken.sol";

contract MetaTransaction {
    SoonToken soonToken;

    constructor(address _CA) {
        soonToken = SoonToken(_CA);
    }

    function mint(
        address[] memory _address,
        uint[] memory token,
        string[] memory message,
        bytes[] memory signature
    ) public {
        for (uint256 i = 0; i < _address.length; i++) {
            // 서명 검증 식을 여기에 작성할것.
            signTransaction(_address[i], message[i], signature[i]);
            soonToken.mint(_address[i], token[i]);
            emit evnet01(_address[i], message[i]);
        }
    }

    function signTransaction(
        address user,
        string memory _msg,
        bytes memory signature
    ) public {
        bytes32 ethSign = getEthSignMsgHash(_msg);
        // 컨트랙트 구조분해 할당
        (bytes32 r, bytes32 s, uint8 v) = splitSign(signature);
        // 서명의 r, .s, v 를 가지고 해시값을 검증하면 공개키가 복구된다.
        // ecrecover 공개키 복원
        emit event02(r, s, v);
        emit event03(ecrecover(ethSign, v, r, s));
        emit event03(user);
        require(user == ecrecover(ethSign, v, r, s));
    }

    function getEthSignMsgHash(
        string memory _msg
    ) internal pure returns (bytes32) {
        // 검증을 하기 위해서는 메시지의 길이를 알아야 검증을 할수 있다.
        uint msgLength = bytes(_msg).length;
        return
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n",
                    Strings.toString(msgLength),
                    _msg
                )
            );
    }

    function splitSign(
        bytes memory sign
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        // 정상적인 서명인지.
        require(sign.length == 65);

        // 수학적인 내용을 컨트랙트에 담을때는 assembly
        assembly {
            // sign 변수의 첫 바이트에서 32 바이트 할당
            r := mload(add(sign, 32))
            // sign 변수의 33번부터 32 바이트 할당
            s := mload(add(sign, 64))
            // 0 번에 65번째 내용까지 할당
            v := byte(0, mload(add(sign, 96)))
        }

        // EIP-155 재생 공격 방지로 추가
        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28);
    }

    event evnet01(address from, string _msg);
    event event02(bytes32 r, bytes32 s, uint8 v);
    event event03(address account);
}