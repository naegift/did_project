import { useEffect } from "react";
// import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { utils, ethers } from "ethers";
import { useRecoilState } from "recoil";
import { walletState } from "../recoil/walletState";

const useWalletAndSuscribe = () => {
  // const [notificationData, setNotificationData] = useState<any | null>(null);
  // const [streamInstance, setStreamInstance] = useState<any | null>(null);
  // const [wallet, setWallet] = useState<any | null>(null);
  // const [walletAddress, setWalletAddress] = useState<string>("");
  const [
    sellerWallets,
    setSellerWallets,
  ] = useRecoilState(walletState);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert(
        "메타마스크를 설치해주세요."
      );
      return;
    }

    try {
      const provider =
        new ethers.providers.Web3Provider(
          window.ethereum
        );
      await provider.send(
        "eth_requestAccounts",
        []
      );
      const signer =
        provider.getSigner();

      // const user = await PushAPI.initialize(signer, {
      //   env: CONSTANTS.ENV.STAGING,
      // });

      const walletAddress =
        await signer.getAddress();
      setSellerWallets({
        walletAddress,
      });
      // window.ethereum.on(
      //   "accountsChanged",
      //   (
      //     ...accounts: Array<string>
      //   ) => {
      //     setSellerWallets({
      //       account: accounts[0],
      //       isLoggedIn: true,
      //     });
      //   }
      // );
    } catch (error) {
      console.error(
        "구독 처리 오류:",
        error
      );
      alert(
        "메타마스크 연결 실패 또는 구독에 실패했습니다."
      );
    }
  };

  useEffect(() => {
    // default: {
    //   walletAddress: "",
    //   isLoggedIn: false,
    // },
    if (window.ethereum) {
      window.ethereum.on(
        "accountsChanged",
        (accounts: string[]) => {
          const preserved =
            accounts.map((e) =>
              ethers.utils.getAddress(e)
            );

          setSellerWallets({
            walletAddress: preserved[0],
          });
        }
      );

      console.log(
        "recoil value: ",
        sellerWallets
      );
    }
  }, []);

  // const initRealTimeNotificationStream = async (user: any) => {
  //   if (!streamInstance) {
  //     try {
  //       const newStreamInstance = await user.initStream([
  //         CONSTANTS.STREAM.NOTIF,
  //       ]);
  //       newStreamInstance.on(CONSTANTS.STREAM.NOTIF, (data: any) => {
  //         console.log("스트림 데이터:", data);
  //         setNotificationData(data);
  //       });
  //       newStreamInstance.connect();
  //       setStreamInstance(newStreamInstance);
  //     } catch (error) {
  //       console.error("스트림 초기화 중 오류 발생:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   return () => {
  //     if (streamInstance) {
  //       streamInstance.disconnect();
  //     }
  //   };
  // }, [streamInstance]);

  return {
    connectWallet,
    // notificationData,
  };
};

export default useWalletAndSuscribe;
