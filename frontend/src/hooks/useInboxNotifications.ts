import { useState, useEffect } from "react";
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { ethers } from "ethers";

const useUserAndNotifications = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUserState] = useState<any | null>(null);
  const [inboxNotifications, setInboxNotifications] = useState<any[]>([]);

  useEffect(() => {
    const initializeUser = async () => {
      if (!window.ethereum) {
        alert("메타마스크를 설치해주세요.");
        setIsInitializing(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      try {
        const initializedUser: any = await PushAPI.initialize(signer, {
          env: CONSTANTS.ENV.STAGING,
        });
        // console.log("사용자 초기화 완료:", initializedUser);
        setUserState(initializedUser);

        const notifications = await initializedUser.notification.list("INBOX");
        // console.log("알림 목록:", notifications);
        setInboxNotifications(notifications);
      } catch (error) {
        console.error("사용자 초기화 중 오류 발생:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeUser();
  }, []);

  return { isInitializing, user, inboxNotifications };
};

export default useUserAndNotifications;
