export const FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_buyer',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_seller',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_receiver',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_market',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_contractPrice',
        type: 'uint256',
      },
    ],
    name: 'createEscrow',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'escrowAddress',
        type: 'address',
      },
    ],
    name: 'EscrowCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'escrowAddress',
        type: 'address',
      },
    ],
    name: 'existEscrow',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
