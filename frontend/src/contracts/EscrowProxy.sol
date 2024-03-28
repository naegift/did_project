// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Escrow.sol";

contract NaegiftEscrowProxy {
    address public latestEscrow;
    address public escrowImplementation;

    event escrowImplementationUpdated(address newImplementation);

    constructor(address _escrowImplementation) {
        updateescrowImplementation(_escrowImplementation);
    }

    function updateescrowImplementation(address _newescrowImplementation) public {
        escrowImplementation = _newescrowImplementation;
        emit escrowImplementationUpdated(_newescrowImplementation);
    }

    fallback() external payable {
        _delegate(escrowImplementation);
    }

    receive() external payable {
        _delegate(escrowImplementation);
    }

    function _delegate(address _implementation) internal {
        require(_implementation != address(0), "Implementation address is not set");
        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}