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

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(GiftModel)
    private readonly giftRepo: Repository<GiftModel>,
    private readonly dataService: DataService,
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
    await this.giftRepo.update(id, { state: stateCode[code] });

    return { state: stateCode[code] };
  }

  async signCredential(credential: UnsignedCredential) {
    const domain = EIP712.domain;
    const types = EIP712.types;
    const signer = new ethers.Wallet(process.env.MARKET_PRIVATE_KEY);
    console.log('here!');
    const signature = await signer._signTypedData(domain, types, credential);
    console.log('there!');
    return signature;
  }

  async verifyCredential(
    id: number,
    VcRes: QueryCredentialsRequestResult,
  ): Promise<boolean> {
    // revoke mechanism

    // const VDR = [];
    // console.log(VcRes);
    // console.log('VDR: ', VDR);
    // console.log(VcRes.metadata.id);
    // if (VDR.includes(VcRes.metadata.id))
    //   throw new BadRequestException('Already used credential.');
    // VDR.push(VcRes.metadata.id);

    const { proof, ...unsignedCredential } = VcRes.data as VerifiableCredential;

    if (!proof || !proof.proofValue || !proof.verificationMethod) {
      throw new UnauthorizedException('Invalid credential proof structure.');
    }

    const domain = EIP712.domain;
    const types = EIP712.types;
    const message = unsignedCredential;
    const signerAddress = process.env.MARKET_ADDRESS;
    try {
      const recoveredAddress = ethers.utils.verifyTypedData(
        domain,
        types,
        message,
        proof.proofValue,
      );
      console.log(recoveredAddress, signerAddress);

      const result =
        recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
      if (result) {
        // const gift = await this.getGift(id);
        // const provider = new ethers.providers.JsonRpcProvider(
        //   process.env.NETWORK_RPC || MockGiftModel.network,
        // );
        // const escrowContract = new ethers.Contract(
        //   gift.contract,
        //   ESCROW_ABI,
        //   provider,
        // );
        // const escrowFulfilled = await escrowContract.confirmFulfillment();
        // console.log(escrowFulfilled)
        this.giftRepo.update(id, { state: State.FULFILLED });
      }
      // push notification to the seller

      // seller sends the item to the receiver

      // receiver confirms the receipt

      return result;
    } catch (e) {
      throw new UnauthorizedException('Invalid credential proof.');
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
    // signature verified (this is the receiver)
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

    // escrow contract call (existEscrow)
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NETWORK_RPC || MockGiftModel.network,
    );
    const escrowFactory = new ethers.Contract(
      process.env.PROXY_CONTRACT,
      FACTORY_ABI,
      provider,
    );
    const result = await escrowFactory.existEscrow(gift.contract);
    if (!result) throw new NotFoundException('Cannot find escrow.');
    // if true, hand over the VC to the receiver
    const payload: UnsignedCredential = {
      type: ['VerifiableCredential', 'DigitalVoucher'],
      credentialSubject: {
        id: `did:ethr:0xaa36a7:${gift.receiver}`,
        type: 'DigitalVoucher',
        voucher: {
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
      },
      credentialSchema: {
        type: 'JsonSchemaValidator2018',
      },
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      issuer: `did:ethr:0xaa36a7:${process.env.MARKET_ADDRESS}`,
      issuanceDate: new Date().toISOString(),
    };

    const signedProof = await this.signCredential(payload);

    const toBeAssigned = {
      proof: {
        verificationMethod: `did:ethr:0xaa36a7:${process.env.MARKET_ADDRESS}#controller`,
        created: payload.issuanceDate,
        proofPurpose: 'assertionMethod',
        type: 'EthereumEip712Signature2021',
        proofValue: `${signedProof}`,
        eip712: EIP712,
      },
    };

    const vc = Object.assign(payload, toBeAssigned);
    this.giftRepo.update(id, { state: State.ISSUED });

    return vc;
  }

  async confirm() {
    // escrow contract call (confirmProductUsed)
    // if escrow state changed, update the gift state
    // metatransaction logic
  }
}
