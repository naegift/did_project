const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PushNotificationSender", function () {
  let pushNotificationSender;
  let owner, recipient;

  beforeEach(async function () {
    // 계정 로드
    [owner, recipient] = await ethers.getSigners();

    // 컨트랙트 배포
    const PushNotificationSender = await ethers.getContractFactory(
      "PushNotificationSender",
      owner
    );
    pushNotificationSender = await PushNotificationSender.deploy();
    await pushNotificationSender.deployed();
  });

  it("should send a push notification", async function () {
    // 백엔드 서버에서 true 값을 전달받았다고 가정
    const backendServerResponse = true;

    if (backendServerResponse) {
      // 테스트를 위한 임의의 제목과 내용
      const title = "Test Notification";
      const body = "This is a test notification body.";

      // sendPushNotification 함수 호출
      await expect(
        pushNotificationSender.sendPushNotification(
          recipient.address,
          title,
          body
        )
      )
        .to.emit(pushNotificationSender, "NotificationSent") // 이벤트 발생 여부 확인
        .withArgs(recipient.address, title, body); // 이벤트 인자 확인

      // 추가적인 상태 검증이 필요한 경우 여기에 구현
    } else {
      // 백엔드 서버에서 false 값을 전달받았을 때의 처리 로직
    }
  });
});
