// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./naegift_escrow_factory.sol";

contract NagiftEscrowProxy {
    address public latestEscrow;
    address public factoryImplementation;

    event FactoryImplementationUpdated(address newImplementation);

    constructor(address _factoryImplementation) {
        updateFactoryImplementation(_factoryImplementation);
    }

    function updateFactoryImplementation(address _newFactoryImplementation) public {
        factoryImplementation = _newFactoryImplementation;
        emit FactoryImplementationUpdated(_newFactoryImplementation);
    }

    fallback() external payable {
        _delegate(factoryImplementation);
    }

    receive() external payable {
        _delegate(factoryImplementation);
    }

    function _delegate(address _implementation) internal {
        require(_implementation != address(0), "Implementation address is not set");
        assembly {
            // calldata를 구현 계약으로 전달
            calldatacopy(0, 0, calldatasize())

            // 구현 계약을 대리 호출
            let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

            // 반환 데이터를 반환
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}