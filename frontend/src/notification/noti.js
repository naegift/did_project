async function sendNotification(user, channelAddress) {
  if (!channelAddress) {
    console.log("권한이 없습니다.");
    return;
  }
  try {
    const message = await user.channel.send(["*"], {
      notification: {
        title: "기프트 사용완료",
        body: "1번 기프트가 사용되었습니다.",
      },
    });
    console.log("전송된 메시지:", message);
  } catch (error) {
    console.error("알림 전송에 실패했습니다:", error);
  }
}

export { sendNotification };
