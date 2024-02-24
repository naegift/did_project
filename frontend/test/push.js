const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PushCommV2", function () {
  let pushCommV2;
  let admin, market, user1, user2;

  beforeEach(async function () {
    [admin, market, user1, user2] = await ethers.getSigners();
    const PushCommV2 = await ethers.getContractFactory("PushNotification");
    pushCommV2 = await PushCommV2.deploy();
    await pushCommV2.deployed();

    await pushCommV2.initialize(user1.address, admin.address, market.address);
  });

  it("구독이 허용되어야 함", async function () {
    expect(await pushCommV2.usersSubscribed(user1.address)).to.equal(true);
  });

  it("구독 시 Subscribe 이벤트가 발생해야 함", async function () {
    await expect(
      pushCommV2.initialize(user2.address, admin.address, market.address)
    )
      .to.emit(pushCommV2, "Subscribe")
      .withArgs(pushCommV2.address, user2.address);
  });

  it("중복 구독 불가", async function () {
    await expect(
      pushCommV2.initialize(user1.address, admin.address, market.address)
    ).to.be.revertedWith("e002");
  });

  it("관리자 또는 마켓만 알림을 보낼 수 있음", async function () {
    const identity = ethers.utils.formatBytes32String("testIdentity");
    await expect(
      pushCommV2
        .connect(admin)
        .sendProductUsageNotification(user1.address, identity)
    )
      .to.emit(pushCommV2, "SendNotification")
      .withArgs(pushCommV2.address, user1.address, identity);

    await expect(
      pushCommV2
        .connect(market)
        .sendProductUsageNotification(user1.address, identity)
    )
      .to.emit(pushCommV2, "SendNotification")
      .withArgs(pushCommV2.address, user1.address, identity);
  });

  it("권한이 없는 주소는 알림을 보낼 수 없음", async function () {
    const identity = ethers.utils.formatBytes32String("testIdentity");
    await expect(
      pushCommV2
        .connect(user2)
        .sendProductUsageNotification(user1.address, identity)
    ).to.be.revertedWith("e001");
  });

  it("구독하지 않은 사용자에게 알림을 보내려고 하면 오류 발생", async function () {
    const identity = ethers.utils.formatBytes32String("testIdentity");
    await expect(
      pushCommV2
        .connect(admin)
        .sendProductUsageNotification(user2.address, identity)
    ).to.be.revertedWith("e003");
  });
});
