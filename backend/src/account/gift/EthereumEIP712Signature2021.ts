export const EIP712 = {
  domain: {
    chainId: 11155111,
    name: 'VerifiableCredential',
    version: '1',
  },
  types: {
    EIP712Domain: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
    ],
    CredentialSchema: [
      {
        name: 'id',
        type: 'string',
      },
      {
        name: 'type',
        type: 'string',
      },
    ],
    CredentialSubject: [
      {
        name: 'category',
        type: 'string',
      },
      {
        name: 'description',
        type: 'string',
      },
      {
        name: 'id',
        type: 'string',
      },
      {
        name: 'image',
        type: 'string',
      },
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'shop',
        type: 'string',
      },
    ],
    Proof: [
      {
        name: 'created',
        type: 'string',
      },
      {
        name: 'proofPurpose',
        type: 'string',
      },
      {
        name: 'type',
        type: 'string',
      },
      {
        name: 'verificationMethod',
        type: 'string',
      },
    ],
    VerifiableCredential: [
      {
        name: '@context',
        type: 'string[]',
      },
      {
        name: 'credentialSchema',
        type: 'CredentialSchema',
      },
      {
        name: 'credentialSubject',
        type: 'CredentialSubject',
      },
      {
        name: 'issuanceDate',
        type: 'string',
      },
      {
        name: 'issuer',
        type: 'string',
      },
      {
        name: 'proof',
        type: 'Proof',
      },
      {
        name: 'type',
        type: 'string[]',
      },
    ],
  },
  primaryType: 'VerifiableCredential',
};
