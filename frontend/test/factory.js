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

    // 수정된 부분: addr3 (receiver) 대신 addr4 (market)를 사용
    await expect(naegiftEscrow.connect(addr4).confirmFulfillment()).to.emit(
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

    await expect(
      naegiftEscrowInstance.connect(addr4).confirmFulfillment()
    ).to.emit(naegiftEscrowInstance, "FulfillmentConfirmed");

    await expect(
      naegiftEscrowInstance.connect(marketSigner).confirmProductUsed()
    ).to.emit(naegiftEscrowInstance, "ProductUsedConfirmed");

    expect(await naegiftEscrowInstance.escrowStatus()).to.equal(3);
  });

  it("판매대금 정산", async function () {
    const buyer = addr1.address;
    const seller = addr2.address;
    const receiver = addr3.address;
    const market = addr4.address;
    const contractPrice = ethers.utils.parseEther("1.0");
    const uuid = "unique-identifier-string";

    // 에스크로 계약 생성
    const tx = await naegiftEscrowFactory.createEscrow(
      buyer,
      seller,
      receiver,
      market,
      contractPrice,
      uuid,
      { value: contractPrice }
    );
    await tx.wait();

    // 에스크로 계약 주소 취득
    const events = await naegiftEscrowFactory.queryFilter(
      naegiftEscrowFactory.filters.EscrowCreated(),
      "latest"
    );
    const escrowAddress = events[0].args.escrowAddress;
    const naegiftEscrow = await ethers.getContractAt(
      "NaegiftEscrow",
      escrowAddress
    );

    // 판매대금 정산 전 셀러와 마켓의 초기 잔액 캡처
    const sellerInitialBalance = await ethers.provider.getBalance(seller);
    const marketInitialBalance = await ethers.provider.getBalance(market);

    // 상품 사용 완료 및 상품 수령 확인을 통한 판매대금 정산
    await naegiftEscrow.connect(addr4).confirmFulfillment();
    await naegiftEscrow.connect(addr4).confirmProductUsed();

    // 판매대금 정산 후 셀러와 마켓의 최종 잔액 캡처
    const sellerFinalBalance = await ethers.provider.getBalance(seller);
    const marketFinalBalance = await ethers.provider.getBalance(market);

    // 계약의 최종 잔액이 0인지 확인
    const contractFinalBalance = await ethers.provider.getBalance(
      naegiftEscrow.address
    );
    expect(contractFinalBalance).to.equal(0);

    // 셀러와 마켓의 잔액 증가분 계산
    const sellerBalanceIncrease = sellerFinalBalance.sub(sellerInitialBalance);
    const marketBalanceIncrease = marketFinalBalance.sub(marketInitialBalance);

    // 셀러와 마켓의 잔액 증가분이 예상대로인지 확인
    const expectedSellerIncrease = contractPrice.mul(9).div(10);
    const expectedMarketIncrease = contractPrice.div(10);

    expect(sellerBalanceIncrease).to.be.closeTo(
      expectedSellerIncrease,
      ethers.utils.parseUnits("0.01", "ether")
    );
    expect(marketBalanceIncrease).to.be.closeTo(
      expectedMarketIncrease,
      ethers.utils.parseUnits("0.01", "ether")
    );
  });
});
