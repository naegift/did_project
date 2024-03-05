import { useState, useEffect } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { walletState } from "../recoil/walletState";
import { streamIdState } from "../recoil/streamState";

const useWalletAndSuscribe = () => {
  const [notificationData, setNotificationData] = useState<any | null>(null);
  const [streamInstance, setStreamInstance] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [sellerWallets, setSellerWallets] = useRecoilState(walletState);
  const [streamId, setStreamId] = useRecoilState(streamIdState);

  const channelAddress = "0x3C51F308502c5fde8c7C1Fa39d35aA621838F7DF";

  const initRealTimeNotificationStream = async (user: any) => {
    // 스트림 인스턴스가 이미 존재하는지 확인합니다.
    if (!streamInstance && sellerWallets.isLoggedIn && user) {
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
        setStreamId(newStreamInstance.id);
      } catch (error) {
        console.error("스트림 초기화 중 오류 발생:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("메타마스크를 설치해주세요.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    if (localStorage.getItem("subscriptions")) {
      const subscriptions: Subscription[] = JSON.parse(
        localStorage.getItem("subscriptions")!
      );

      const isSubscribedToChannel = subscriptions.some(
        (subscription: Subscription) =>
          subscription.channel.toLowerCase() === channelAddress.toLowerCase()
      );
      if (!user && isSubscribedToChannel) {
        try {
          const initializedUser = await PushAPI.initialize(signer, {
            env: CONSTANTS.ENV.STAGING,
          });

          setUser(initializedUser);

          if (!isSubscribedToChannel) {
            const response = await initializedUser.notification.subscribe(
              `eip155:11155111:${channelAddress}`
            );
            console.log("구독 응답:", response);
          } else {
            console.log("이미 현재 채널에 구독되어 있습니다.");
          }

          localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

          window.ethereum.on(
            "accountsChanged",
            async (accounts: Array<string>) => {
              if (accounts.length > 0) {
                const newProvider = new ethers.providers.Web3Provider(
                  window.ethereum
                );
                const newSigner = newProvider.getSigner();
                const newUser = await PushAPI.initialize(newSigner, {
                  env: CONSTANTS.ENV.STAGING,
                });
                setUser(newUser);
                setSellerWallets({
                  walletAddress: accounts[0],
                  isLoggedIn: true,
                  isSubscribed: false,
                });
                await initRealTimeNotificationStream(newUser);
              } else {
                setSellerWallets({
                  walletAddress: "",
                  isLoggedIn: false,
                  isSubscribed: false,
                });
                if (streamInstance) {
                  streamInstance.disconnect();
                }
              }
            }
          );

          if (initializedUser) {
            await initRealTimeNotificationStream(initializedUser);
          }
        } catch (error) {
          console.error("구독 처리 오류:", error);
          alert("메타마스크 연결 실패 또는 구독에 실패했습니다.");
        }
      }
    }

    // const subscriptions: Subscription[] =
    //   await initializedUser.notification.subscriptions();
    // const isSubscribedToChannel = subscriptions.some(
    //   (subscription: Subscription) =>
    //     subscription.channel.toLowerCase() === channelAddress.toLowerCase()
    // );
  };

  useEffect(() => {
    connectWallet();
    if (sellerWallets.isLoggedIn && user) {
      initRealTimeNotificationStream(user);
    }
  }, [sellerWallets, user]);

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
  };
};
export default useWalletAndSuscribe;
