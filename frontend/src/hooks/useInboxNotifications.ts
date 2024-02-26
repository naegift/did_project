import { useState } from "react";

const useInboxNotifications = (user: any) => {
  const [inboxNotifications, setInboxNotifications] = useState<any | null>([]);

  const inboxNotification = async () => {
    try {
      const notifications = await user.notification.list("INBOX");
      console.log("알림 목록:", notifications);
      setInboxNotifications(notifications);
    } catch (error) {
      console.error("알림을 가져오는데 실패했습니다:", error);
    }
  };

  return {
    inboxNotification,
    inboxNotifications,
  };
};

export default useInboxNotifications;
