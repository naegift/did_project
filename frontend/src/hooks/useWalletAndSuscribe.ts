import { useState, useEffect } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { walletState } from "../recoil/walletState";
import { streamIdState } from "../recoil/streamState";

const useWalletAndSuscribe = () => {
  const [notificationData, setNotificationData] = useState<any | null>(null);
  const [streamInstance, setStreamInstance] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null); // user 상태 추가
  const [sellerWallets, setSellerWallets] = useRecoilState(walletState);
  const [streamId, setStreamId] = useRecoilState(streamIdState);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("메타마스크를 설치해주세요.");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      if (sellerWallets.isLoggedIn && sellerWallets.isSubscribed) {
        console.log("이미 로그인 및 구독 완료 상태입니다.");
        return;
      }

      const initializedUser = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });

      setUser(initializedUser);

      const walletAddress = await signer.getAddress();
      const channelAddress = "0x3C51F308502c5fde8c7C1Fa39d35aA621838F7DF";

      if (!sellerWallets.isSubscribed) {
        const response = await initializedUser.notification.subscribe(
          `eip155:11155111:${channelAddress}`
        );
        console.log(response);

        setSellerWallets({
          walletAddress,
          isLoggedIn: true,
          isSubscribed: true,
        });
      } else {
        setSellerWallets({
          ...sellerWallets,
          walletAddress,
          isLoggedIn: true,
        });
      }

      window.ethereum.on(
        "accountsChanged",

//         (accounts: string[]) => {
//           const preserved =
//             accounts.map((e) =>
//               ethers.utils.getAddress(e)
//             );

//           setSellerWallets({
//             walletAddress: preserved[0],
//           });

        async (...accounts: Array<string>) => {
          if (accounts.length > 0) {
            setSellerWallets({
              walletAddress: accounts[0],
              isLoggedIn: true,
            });
            if (initializedUser) {
              await initRealTimeNotificationStream(initializedUser);
            }
          } else {
            setSellerWallets({
              walletAddress: "",
              isLoggedIn: false,
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
  };

  useEffect(() => {
    connectWallet();
    if (sellerWallets.isLoggedIn && user) {
      initRealTimeNotificationStream(user);
    }
  }, [sellerWallets.isLoggedIn, user]);

  const initRealTimeNotificationStream = async (user: any) => {
    if (sellerWallets.isLoggedIn && user) {
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
