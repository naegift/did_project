// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MetaTransaction {
    address private market;

    constructor(address _market) {
        market = _market;
    }

        // 가스비를 기록하는 함수
        function recordGasFee(uint256 _gasFee) public {
            // 여기에 가스비를 데이터베이스에 기록하는 로직 구현
        }
        
        // 24시간마다 호출되어 가스비를 정산하는 함수
        function settleGasFees() public {
            // 여기에 집계된 가스비를 마켓의 지갑에서 지불하는 로직 구현
        }

        function signTransaction(
        address market,
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