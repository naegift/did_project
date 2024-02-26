// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PushNotification.sol";

contract NagiftEscrowProxy {
    address public pushImplementation;

    event PushImplementationUpdated(address newImplementation);

    constructor(address _pushImplementation) {
        updatePushImplementation(_pushImplementation);
    }

    function updatePushImplementation(address _newPushImplementation) public {
        pushImplementation = _newPushImplementation;
        emit PushImplementationUpdated(_newPushImplementation);
    }

    fallback() external payable {
        _delegate(pushImplementation);
    }

    receive() external payable {
        _delegate(pushImplementation);
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