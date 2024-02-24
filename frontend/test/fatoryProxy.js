const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NaegiftEscrowProxy", function () {
  let NaegiftEscrowProxy, naegiftEscrowProxy, EscrowFactory, escrowFactory;

  beforeEach(async function () {
    EscrowFactory = await ethers.getContractFactory("NaegiftEscrowFactory");
    escrowFactory = await EscrowFactory.deploy();
    await escrowFactory.deployed();

    NaegiftEscrowProxy = await ethers.getContractFactory("NaegiftEscrowProxy");
    naegiftEscrowProxy = await NaegiftEscrowProxy.deploy(escrowFactory.address);
    await naegiftEscrowProxy.deployed();
  });

  it("팩토리 구현체 업데이트", async function () {
    const newEscrowFactory = await EscrowFactory.deploy();
    await newEscrowFactory.deployed();

    await naegiftEscrowProxy.updateFactoryImplementation(
      newEscrowFactory.address
    );

    expect(await naegiftEscrowProxy.factoryImplementation()).to.equal(
      newEscrowFactory.address
    );
  });

  it("FactoryImplementationUpdated 이벤트 로깅", async function () {
    const newEscrowFactory = await EscrowFactory.deploy();
    await newEscrowFactory.deployed();

    await expect(
      naegiftEscrowProxy.updateFactoryImplementation(newEscrowFactory.address)
    )
      .to.emit(naegiftEscrowProxy, "FactoryImplementationUpdated")
      .withArgs(newEscrowFactory.address);
  });
});
