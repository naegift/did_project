// const EIP712Domain = [
//   { name: 'name', type: 'string' },
//   { name: 'version', type: 'string' },
//   { name: 'chainId', type: 'uint256' },
//   { name: 'verifyingContract', type: 'address' },
// ];

const DigitalVoucher = [
  { name: 'giftID', type: 'uint256' },
  { name: 'contract', type: 'address' },
  { name: 'buyer', type: 'address' },
  { name: 'receiver', type: 'address' },
  { name: 'title', type: 'string' },
  { name: 'content', type: 'string' },
  { name: 'image', type: 'string' },
  { name: 'price', type: 'uint256' },
  { name: 'seller', type: 'address' },
];

const CredentialSubject = [
  { name: 'id', type: 'string' },
  { name: 'type', type: 'string' },
  { name: 'voucher', type: 'DigitalVoucher' }, // Referencing the DigitalVoucher type
];

const CredentialSchema = [{ name: 'type', type: 'string' }];

const UnsignedCredential = [
  { name: 'type', type: 'string[]' },
  { name: 'credentialSubject', type: 'CredentialSubject' },
  { name: 'credentialSchema', type: 'CredentialSchema' },
  { name: '@context', type: 'string[]' },
  { name: 'issuer', type: 'string' },
  { name: 'issuanceDate', type: 'string' },
];

export const EIP712 = {
  domain: {
    chainId: 11155111,
    name: 'VerifiableCredential',
    version: '1',
  },
  types: {
    // EIP712Domain,
    DigitalVoucher,
    CredentialSubject,
    CredentialSchema,
    VerifiableCredential: UnsignedCredential,
  },
  primaryType: 'VerifiableCredential',
};
