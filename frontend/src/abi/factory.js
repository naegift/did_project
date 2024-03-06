export const FACTORY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "escrowAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "uuid",
        type: "string",
      },
    ],
    name: "EscrowCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_buyer",
        type: "address",
      },
      {
        internalType: "address",
        name: "_seller",
        type: "address",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_contractPrice",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "uuid",
        type: "string",
      },
    ],
    name: "createEscrow",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "escrowAddress",
        type: "address",
      },
    ],
    name: "existEscrow",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
