const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NaegiftEscrowFactory and naegift_escrow", function () {
  let naegiftEscrowFactory;
  let naegiftEscrow;
  let addr1, addr2, addr3, addr4;

  beforeEach(async function () {
    const NaegiftEscrowFactory = await ethers.getContractFactory(
      "NaegiftEscrowFactory"
    );
    naegiftEscrowFactory = await NaegiftEscrowFactory.deploy();
    await naegiftEscrowFactory.deployed();

    [addr1, addr2, addr3, addr4] = await ethers.getSigners();
  });

  it("에스크로 인스턴스 생성 및 이더리움 송금", async function () {
    const buyer = addr1.address;
    const seller = addr2.address;
    const receiver = addr3.address;
    const market = addr4.address;
    const contractPrice = ethers.utils.parseEther("1.0");
    const uuid = "unique-identifier-string";

    const tx = await naegiftEscrowFactory.createEscrow(
      buyer,
      seller,
      receiver,
      market,
      contractPrice,
      uuid,
      { value: contractPrice }
    );
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "EscrowCreated"
    );
    const escrowAddress = event.args.escrowAddress;

    const balance = await ethers.provider.getBalance(escrowAddress);

    expect(balance).to.equal(contractPrice);

    expect(await naegiftEscrowFactory.existEscrow(escrowAddress)).to.be.true;

    const NaegiftEscrow = await ethers.getContractFactory("NaegiftEscrow");
    naegiftEscrow = NaegiftEscrow.attach(escrowAddress);

    expect(await naegiftEscrow.escrowStatus()).to.equal(1);
  });

  it("상품 사용 완료", async function () {
    const buyer = addr1.address;
    const seller = addr2.address;
    const receiver = addr3.address;
    const market = addr4.address;
    const contractPrice = ethers.utils.parseEther("1.0");
    const uuid = "unique-identifier-string";

    const tx = await naegiftEscrowFactory.createEscrow(
      buyer,
      seller,
      receiver,
      market,
      contractPrice,
      uuid,
      { value: contractPrice }
    );
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "EscrowCreated"
    );
    const escrowAddress = event.args.escrowAddress;

    const NaegiftEscrow = await ethers.getContractFactory("NaegiftEscrow");
    naegiftEscrow = NaegiftEscrow.attach(escrowAddress);

    await expect(naegiftEscrow.connect(addr3).confirmFulfillment()).to.emit(
      naegiftEscrow,
      "FulfillmentConfirmed"
    );

    expect(await naegiftEscrow.escrowStatus()).to.equal(2);
  });

  it("상품 수령 확인", async function () {
    const buyerSigner = addr1;
    const sellerSigner = addr2;
    const receiverSigner = addr3;
    const marketSigner = addr4;
    const contractPrice = ethers.utils.parseEther("1.0");
    const uuid = "unique-identifier-string";

    const tx = await naegiftEscrowFactory.createEscrow(
      buyerSigner.address,
      sellerSigner.address,
      receiverSigner.address,
      marketSigner.address,
      contractPrice,
      uuid,
      { value: contractPrice }
    );
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "EscrowCreated"
    );
    const escrowAddress = event.args.escrowAddress;

    const NaegiftEscrow = await ethers.getContractFactory("NaegiftEscrow");
    const naegiftEscrowInstance = NaegiftEscrow.attach(escrowAddress);

    await naegiftEscrowInstance.connect(receiverSigner).confirmFulfillment();

    await expect(
      naegiftEscrowInstance.connect(marketSigner).confirmProductUsed()
    ).to.emit(naegiftEscrowInstance, "ProductUsedConfirmed");

    expect(await naegiftEscrowInstance.escrowStatus()).to.equal(4);
  });

  it("판매대금 정산", async function () {
    const buyer = addr1.address;
    const seller = addr2.address;
    const receiver = addr3.address;
    const market = addr4.address;
    const contractPrice = ethers.utils.parseEther("1.0");
    const uuid = "unique-identifier-string";

    const tx = await naegiftEscrowFactory.createEscrow(
      buyer,
      seller,
      receiver,
      market,
      contractPrice,
      uuid,
      { value: contractPrice }
    );
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "EscrowCreated"
    );
    const escrowAddress = event.args.escrowAddress;

    const NaegiftEscrow = await ethers.getContractFactory("NaegiftEscrow");
    naegiftEscrow = NaegiftEscrow.attach(escrowAddress);

    await naegiftEscrow.connect(addr3).confirmFulfillment();
    await naegiftEscrow.connect(addr4).confirmProductUsed();

    const sellerInitialBalance = await ethers.provider.getBalance(seller);
    const marketInitialBalance = await ethers.provider.getBalance(market);

    const sellerFinalBalance = await ethers.provider.getBalance(seller);
    const marketFinalBalance = await ethers.provider.getBalance(market);

    const marketShare = contractPrice.div(10);
    const sellerShare = contractPrice.sub(marketShare);

    expect(sellerFinalBalance.sub(sellerInitialBalance)).to.equal(
      contractPrice.sub(sellerShare.add(marketShare))
    );
    expect(marketFinalBalance.sub(marketInitialBalance)).to.equal(
      contractPrice.sub(sellerShare.add(marketShare))
    );

    const contractFinalBalance = await ethers.provider.getBalance(
      naegiftEscrow.address
    );
    expect(contractFinalBalance).to.equal(0);
  });
});
