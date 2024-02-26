import { useState, useEffect } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const useWalletAndNotifications = () => {
  const [userAlice, setUserAlice] = useState<any | null>(null);
  const [notificationData, setNotificationData] = useState<any | null>(null);
  const [streamInstance, setStreamInstance] = useState<any | null>(null);
  const [inboxNotifications, setInboxNotifications] = useState<any | null>([]);
  const channelAddress = process.env.REACT_APP_CHANNEL_ADDRESS;

  // 지갑 연결 및 구독
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("메타마스크를 설치해주세요.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const user = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });
      setUserAlice(user);

      await initRealTimeNotificationStream(user);

      if (!channelAddress) {
        console.error("채널 주소 없음");
        alert("채널 주소가 설정되지 않았습니다.");
        return;
      }

      const currentSubscriptions = await user.notification.subscriptions();
      const isAlreadySubscribed = currentSubscriptions.some(
        (subscription: any) =>
          subscription.channel.toLowerCase() === channelAddress.toLowerCase()
      );

      if (isAlreadySubscribed) {
        console.log("이미 구독중");
        alert("이미 구독중인 채널입니다.");
        return;
      }

      const subscriptionResult = await user.notification.subscribe(
        `eip155:11155111:${channelAddress}`
      );
      console.log("구독 결과:", subscriptionResult);
      alert("구독에 성공했습니다!");
    } catch (error) {
      console.error("구독 처리 오류:", error);
      alert("메타마스크 연결 실패 또는 구독에 실패했습니다.");
    }
  };

  // 실시간 스트림 초기화
  const initRealTimeNotificationStream = async (userAlice: any) => {
    if (!streamInstance) {
      try {
        const newStreamInstance = await userAlice.initStream([
          CONSTANTS.STREAM.NOTIF,
        ]);
        newStreamInstance.on(CONSTANTS.STREAM.NOTIF, (data: any) => {
          console.log("스트림 데이터:", data);
          setNotificationData(data);
        });
        newStreamInstance.connect();
        setStreamInstance(newStreamInstance);
      } catch (error) {
        console.error("스트림 초기화 중 오류 발생:", error);
      }
    }
  };

  // 받은 알림 목록 조회
  const inboxNotification = async () => {
    try {
      const notifications = await userAlice.notification.list("INBOX");
      console.log("알림 목록:", notifications);
      setInboxNotifications(notifications);
    } catch (error) {
      console.error("알림을 가져오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (streamInstance) {
        streamInstance.disconnect();
      }
    };
  }, [streamInstance]);

  return {
    connectWallet,
    inboxNotification,
    notificationData,
    inboxNotifications,
  };
};

export default useWalletAndNotifications;
