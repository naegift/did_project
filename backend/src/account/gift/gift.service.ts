import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResGetState } from './dto/res-get-state.dto';
import { ethers } from 'ethers';
import { ESCROW_ABI } from 'src/__base-code__/abi/escrow.abi';
import { State, stateCode } from 'src/__base-code__/enum/state.enum';
import { GiftModel } from 'src/__base-code__/entity/gift.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockGiftModel } from 'src/__base-code__/mock/entity/gift.mock';
import { ResGetGifts } from './dto/res-get-gifts.dto';
import { DataService } from 'src/common/data/data.service';
import { Order } from 'src/__base-code__/enum/order.enum';
import { FACTORY_ABI } from 'src/__base-code__/abi/factory.abi';
import {
  MinimalUnsignedCredential,
  QueryCredentialsRequestResult,
} from '@blockchain-lab-um/masca-connector';

import {
  UnsignedCredential,
  VerifiableCredential,
  W3CVerifiableCredential,
} from '@veramo/core';
import { EIP712 } from './EthereumEIP712Signature2021';
import { _TypedDataEncoder } from 'ethers/lib/utils';
import { ReqReceiveGift } from './dto/req-receive-gift.dto';
import { VcService } from 'src/common/vc/vc.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(GiftModel)
    private readonly giftRepo: Repository<GiftModel>,
    private readonly dataService: DataService,
    private readonly vcService: VcService,
    private readonly notificationService: NotificationService,
  ) {}

  async getGift(id: number): Promise<GiftModel> {
    const gift = await this.giftRepo.findOne({ where: { id } });
    if (!gift) throw new NotFoundException('Cannot find gift.');

    return gift;
  }

  async getGifts(
    buyer: string,
    receiver: string,
    page: number,
    order: Order,
  ): Promise<ResGetGifts> {
    const take = 3;
    const skip = take * (page - 1);
    const findAndCount = await this.giftRepo.findAndCount({
      where: receiver ? { receiver } : { buyer },
      order: { id: order },
      take,
      skip,
    });

    const { array: gifts, totalPages } = this.dataService.pagination(
      findAndCount,
      take,
    );

    return { gifts, totalPages };
  }

  async getState(id: number): Promise<ResGetState> {
    const gift = await this.getGift(id);
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NETWORK_RPC || MockGiftModel.network,
    );
    const escrow = new ethers.Contract(gift.contract, ESCROW_ABI, provider);

    const code = Number(await escrow.escrowStatus());
    // await this.giftRepo.update(id, { state: stateCode[code] });

    return { state: stateCode[code] };
  }

  // async signCredential(credential: UnsignedCredential) {
  //   const domain = EIP712.domain;
  //   const types = EIP712.types;
  //   const signer = new ethers.Wallet(process.env.MARKET_PRIVATE_KEY);
  //   const signature = await signer._signTypedData(domain, types, credential);
  //   return signature;
  // }

  // async verifyCredential(
  //   id: number,
  //   VcRes: QueryCredentialsRequestResult,
  // ): Promise<boolean> {

  //   const { proof, ...unsignedCredential } = VcRes.data as VerifiableCredential;

  //   if (!proof || !proof.proofValue || !proof.verificationMethod) {
  //     throw new UnauthorizedException('Invalid credential proof structure.');
  //   }

  //   const domain = EIP712.domain;
  //   const types = EIP712.types;
  //   const message = unsignedCredential;
  //   const signerAddress = process.env.MARKET_ADDRESS;
  //   try {
  //     const recoveredAddress = ethers.utils.verifyTypedData(
  //       domain,
  //       types,
  //       message,
  //       proof.proofValue,
  //     );
  //     console.log(recoveredAddress, signerAddress);

  //     const result =
  //       recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
  // if (result) {
  //   const gift = await this.getGift(id);
  //   const provider = new ethers.providers.JsonRpcProvider(
  //     process.env.NETWORK_RPC || MockGiftModel.network,
  //   );
  //   const escrowContract = new ethers.Contract(
  //     gift.contract,
  //     ESCROW_ABI,
  //     provider,
  //   );
  //   const escrowFulfilled = await escrowContract.confirmFulfillment();
  //   console.log(escrowFulfilled)
  //   this.giftRepo.update(id, { state: State.FULFILLED });
  // }
  //     // push notification to the seller

  //     // seller sends the item to the receiver

  //     // receiver confirms the receipt

  //     return result;
  //   } catch (e) {
  //     throw new UnauthorizedException('Invalid credential proof.');
  //   }
  // }

  async checkSavedCredential(id: number, saveResponse: { success: boolean }) {
    console.log(saveResponse);
    if (saveResponse.success) {
      await this.giftRepo.update(id, { state: State.ISSUED });
      return { success: true };
    } else {
      return { success: false };
    }
  }

  async receiveGift(
    id: number,
    reqReceiveGift: ReqReceiveGift,
  ): Promise<VerifiableCredential> {
    const gift = await this.getGift(id);
    // check if the gift was already issued and received
    if (gift.state === State.ISSUED)
      throw new BadRequestException(
        'The gift was already issued and received.',
      );
    // signature verified
    const message = {
      title: reqReceiveGift.title,
      content: reqReceiveGift.content,
      price: reqReceiveGift.price,
    };

    const signature = reqReceiveGift.signature;

    const signer = ethers.utils.verifyMessage(
      JSON.stringify(message),
      signature,
    );
    if (signer !== gift.receiver)
      throw new UnauthorizedException('Invalid signature.');

    const agent = await this.vcService.getAgent();

    await agent.didManagerGetOrCreate({
      alias: 'market',
    });

    const identifier = await agent.didManagerGetByAlias({
      alias: 'market',
    });

    const payload: MinimalUnsignedCredential = {
      type: ['VerifiableCredential', 'DigitalVoucher'],
      issuer: { id: identifier.did },
      credentialSubject: {
        id: `did:ethr:0xaa36a7:${gift.receiver}`,
        type: 'DigitalVoucher',
        giftID: gift.id,
        contract: gift.contract,
        buyer: gift.buyer,
        receiver: gift.receiver,
        title: gift.title,
        content: gift.content,
        image: gift.image,
        price: gift.price,
        seller: gift.seller,
      },
      credentialStatus: {
        type: 'StatusList2021Entry',
        id: `http://localhost:4000/gift/${gift.id}/credentialStatus`,
      },
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      proofFormat: 'EthereumEip712Signature2021',
    };

    const verifiableCredential = await agent.createVerifiableCredential({
      credential: payload,
      proofFormat: 'EthereumEip712Signature2021',
    });

    const status = await agent.checkCredentialStatus({
      credential: verifiableCredential,
      didDocumentOverride: { id: identifier.did },
    });
    console.log('Is this revoked?', status);

    const result = await agent.verifyCredential({
      credential: verifiableCredential,
    });
    console.log('Is this verified? ', result);

    return verifiableCredential;

    // const signedProof = await this.signCredential(payload);

    // const toBeAssigned = {
    //   proof: {
    //     verificationMethod: `did:ethr:0xaa36a7:${process.env.MARKET_ADDRESS}#controller`,
    //     created: payload.issuanceDate,
    //     proofPurpose: 'assertionMethod',
    //     type: 'EthereumEip712Signature2021',
    //     proofValue: `${signedProof}`,
    //     eip712: EIP712,
    //   },
    // };
  }

  async verifyCredential(id: number, VcRes: QueryCredentialsRequestResult) {
    const agent = await this.vcService.getAgent();
    const verifiableCredential = VcRes.data as VerifiableCredential;

    // check if this is revoked
    const status = await agent.checkCredentialStatus({
      credential: verifiableCredential,
    });
    console.log('Is this revoked?', status);

    if (status.revoked) throw new UnauthorizedException('Revoked.');

    const verificationResult = await agent.verifyCredential({
      credential: verifiableCredential,
    });

    console.log(verificationResult);

    if (verificationResult.verified) {
      const gift = await this.getGift(id);

      console.log(gift.contract);

      try {
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.NETWORK_RPC || MockGiftModel.network,
        );

        const privateKey = process.env.MARKET_PRIVATE_KEY;
        if (!privateKey) throw new Error('No private key.');
        const signer = new ethers.Wallet(privateKey, provider);

        const escrowContract = new ethers.Contract(
          gift.contract,
          ESCROW_ABI,
          signer,
        );

        await escrowContract.confirmFulfillment({
          gasLimit: '1000000',
        });

        escrowContract.on('FulfillmentConfirmed', async () => {
          console.log('Fulfilled 상태 전환');
          await this.giftRepo.update(id, { state: State.FULFILLED });
          // push notification to the seller
          await this.notificationService.sendNotification(gift.seller);
        });
      } catch (e) {
        throw e;
      }

      // const escrowStatus = await this.escrowStateCheck(id);

      return { success: true };
    } else throw new UnauthorizedException('Not fulfilled.');
  }

  async confirm(id: number) {
    // escrow contract call (confirmProductUsed)
    const gift = await this.getGift(id);

    if (gift.state === State.EXECUTED)
      throw new BadRequestException('Already executed.');

    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NETWORK_RPC || MockGiftModel.network,
    );
    const privateKey = process.env.MARKET_PRIVATE_KEY;
    if (!privateKey) throw new Error('No private key.');
    const signer = new ethers.Wallet(privateKey, provider);

    const escrowContract = new ethers.Contract(
      gift.contract,
      ESCROW_ABI,
      signer,
    );

    await escrowContract.confirmProductUsed({
      gasLimit: '1000000',
    });

    // if escrow state changed, update the gift state

    escrowContract.on('FundsDistributed', async () => {
      console.log('정산 함수가 정상적으로 실행됨');
      await this.giftRepo.update(id, { state: State.EXECUTED });
    });

    // const escrowStatus = await this.escrowStateCheck(id);

    return { success: true };
  }

  async escrowStateCheck(id: number) {
    const gift = await this.getGift(id);
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NETWORK_RPC || MockGiftModel.network,
    );
    const escrow = new ethers.Contract(gift.contract, ESCROW_ABI, provider);

    const result = await escrow.contractState();
    console.log('Contract state: ', result);
    return result;
  }
}
