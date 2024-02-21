import { ApiProperty } from '@nestjs/swagger';

export class ReqUseGift {
  @ApiProperty({
    example: {
      holder: 'did:ethr:0x1:0x50d3dadcc4f2ab5270f5b533f0c565cb4e7ab1c3',
      verifiableCredential: [],
      issuanceDate: '2024-02-21T04:58:45.087Z',
      '@context': [],
      proof: {
        verificationMethod:
          'did:ethr:0x1:0x50d3dadcc4f2ab5270f5b533f0c565cb4e7ab1c3#controller',
        created: '2024-02-21T04:58:45.087Z',
        proofPurpose: 'assertionMethod',
      },
      type: ['VerifiablePresentation', 'Custom'],
    },
  })
  vp: object;
}
