import { useState, useEffect } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { walletState } from "../recoil/walletState";
import { streamIdState } from "../recoil/streamState";

// 사용자 지갑과 구독을 관리하는 커스텀 훅
const useWalletAndSubscribe = () => {
  const [notificationData, setNotificationData] = useState<any[]>([]);
  const [streamInstance, setStreamInstance] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [sellerWallets, setSellerWallets] = useRecoilState(walletState);
  const [streamId, setStreamId] = useRecoilState(streamIdState);

  // 채널 주소
  const channelAddress = "0x3C51F308502c5fde8c7C1Fa39d35aA621838F7DF";

  // 실시간 알림 스트림 초기화
  const initRealTimeNotificationStream = async (user: any) => {
    if (!streamInstance && sellerWallets.walletAddress && user) {
      try {
        const newStream = await user.initStream([CONSTANTS.STREAM.NOTIF]);
        newStream.on(CONSTANTS.STREAM.NOTIF, (data: any) => {
          console.log("받은 데이터:", data.message.notification);
          setNotificationData((oldData: any) => [...oldData, data]);
        });
        console.log("스트림 초기화 완료:", newStream);
        newStream.connect();
        setStreamInstance(newStream);
        setStreamId(newStream.id);
      } catch (error) {
        console.error("스트림 초기화 중 오류 발생:", error);
      }
    }
  };

  // 체인 변경 처리 로직
  const handleChainChanged = async (chainId: string) => {
    console.log(chainId);
    if (chainId !== process.env.REACT_APP_TARGET_CHAINID?.toLowerCase()) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: process.env.REACT_APP_TARGET_CHAINID }],
      });
    }
  };

  // 사용자 및 스트림 인스턴스 초기화 로직
  const initializeUserAndStream = async (signer: any): Promise<void> => {
    try {
      const initializedUser = await PushAPI.initialize(signer, {
        env: CONSTANTS.ENV.STAGING,
      });
      console.log(initializedUser);
      setUser(initializedUser);

      const subscriptions = await initializedUser.notification.subscriptions();
      const isSubscribed = subscriptions.some(
        (sub: { channel: string }) =>
          sub.channel.toLowerCase() === channelAddress.toLowerCase()
      );
      if (!isSubscribed) {
        await initializedUser.notification.subscribe(
          `eip155:11155111:${channelAddress}`
        );
      }

      await initRealTimeNotificationStream(initializedUser);
    } catch (error) {
      console.error("사용자 및 스트림 초기화 중 오류 발생:", error);
    }
  };

  // 지갑 연결
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("메타마스크를 설치해주세요.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const handleChainChanged = async (chainId: string) => {
      console.log(typeof chainId, chainId);

      if (chainId !== process.env.REACT_APP_TARGET_CHAINID) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: process.env.REACT_APP_TARGET_CHAINID,
            },
          ],
        });
        window.location.reload();
      }
    };

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    await handleChainChanged(chainId);

    window.ethereum.on("chainChanged", handleChainChanged);

    await initializeUserAndStream(signer);
  };

  // 계정 변경 감지 및 처리
  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        const newSigner = new ethers.providers.Web3Provider(
          window.ethereum
        ).getSigner();
        const preserved = accounts.map((e) => ethers.utils.getAddress(e));
        setSellerWallets({
          walletAddress: preserved[0],
          isSubscribed: true,
        });
        console.log(sellerWallets);

        if (streamInstance) {
          streamInstance.disconnect();
          setStreamInstance(null);
        }

        await initializeUserAndStream(newSigner);
      } else {
        setUser(null);
        setSellerWallets({ walletAddress: "", isSubscribed: false });
        if (streamInstance) {
          streamInstance.disconnect();
          setStreamInstance(null);
        }
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [streamInstance, user, sellerWallets]);

  // 지갑 연결 및 스트림 초기화
  useEffect(() => {
    connectWallet();
  }, []);

  // 컴포넌트 언마운트 시 스트림 인스턴스 연결 해제
  useEffect(() => {
    return () => {
      if (streamInstance) {
        console.log("컴포넌트 언마운트 시 스트림 인스턴스 연결 해제");
        streamInstance.disconnect();
      }
    };
  }, [streamInstance]);

  return {
    connectWallet,
    notificationData,
  };
};

export default useWalletAndSubscribe;
