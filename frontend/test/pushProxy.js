const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NagiftEscrowProxy", function () {
  let PushNoti, pushNoti, NagiftEscrowProxy, nagiftEscrowProxy;

  beforeEach(async function () {
    // PushNoti 컨트랙트 배포
    PushNoti = await ethers.getContractFactory("PushNotification");
    pushNoti = await PushNoti.deploy();
    await pushNoti.deployed();

    // NagiftEscrowProxy 컨트랙트 배포, PushNoti 주소를 생성자에 전달
    NagiftEscrowProxy = await ethers.getContractFactory("NagiftEscrowProxy");
    nagiftEscrowProxy = await NagiftEscrowProxy.deploy(pushNoti.address);
    await nagiftEscrowProxy.deployed();
  });

  it("푸시 구현체 업데이트", async function () {
    const newPushNoti = await PushNoti.deploy();
    await newPushNoti.deployed();

    await nagiftEscrowProxy.updatePushImplementation(newPushNoti.address);

    expect(await nagiftEscrowProxy.pushImplementation()).to.equal(
      newPushNoti.address
    );
  });

  it("PushImplementationUpdated 이벤트 로깅", async function () {
    const newPushNoti = await PushNoti.deploy();
    await newPushNoti.deployed();

    await expect(
      nagiftEscrowProxy.updatePushImplementation(newPushNoti.address)
    )
      .to.emit(nagiftEscrowProxy, "PushImplementationUpdated")
      .withArgs(newPushNoti.address);
  });

  // 추가적인 대리 호출 테스트는 PushNoti 컨트랙트의 구체적인 함수와 기능에 따라 달라질 수 있습니다.
});
