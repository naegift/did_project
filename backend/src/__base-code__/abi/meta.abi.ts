export const META_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_msg',
        type: 'string',
      },
    ],
    name: 'Event01',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'r',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'v',
        type: 'uint8',
      },
    ],
    name: 'Event02',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Event03',
    type: 'event',
  },
  {
    inputs: [],
    name: 'checkGas',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'users',
        type: 'address[]',
      },
      {
        internalType: 'bytes[]',
        name: 'signatures',
        type: 'bytes[]',
      },
      {
        internalType: 'string[]',
        name: 'messages',
        type: 'string[]',
      },
    ],
    name: 'processBatchTransactions',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'string',
        name: '_msg',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'signTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
];
