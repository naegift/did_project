import { useState, useEffect } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

const useWalletAndSuscribe = () => {
  const [user, setUser] = useState<any | null>(null);
  const [notificationData, setNotificationData] = useState<any | null>(null);
  const [streamInstance, setStreamInstance] = useState<any | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false); // 로그인 상태를 추적하는 상태 추가

  // 채널주소는 추후 마켓주소로 변경예정
  const channelAddress = "0xb2b7cf04a31d943fbf14ea4575112d9b3aa2d3e3";

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("메타마스크를 설치해주세요.");
      return;
    }

    if (isLogged) {
      alert("이미 로그인 중입니다.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const user = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });
      setUser(user);
      setIsLogged(true);

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

  const initRealTimeNotificationStream = async (user: any) => {
    if (!streamInstance) {
      try {
        const newStreamInstance = await user.initStream([
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

  useEffect(() => {
    return () => {
      if (streamInstance) {
        streamInstance.disconnect();
      }
    };
  }, [streamInstance]);

  return {
    connectWallet,
    notificationData,
    user,
  };
};

export default useWalletAndSuscribe;
