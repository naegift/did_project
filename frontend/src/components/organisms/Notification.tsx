import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Notification() {
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/notifications");
        console.log("알림 데이터를 가져왔습니다.", response);
        setNotificationData(response.data);

        response.data.forEach((notification: any) => {
          toast(`${notification.title || "알림"}: ${notification.body}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      } catch (error) {
        console.error("알림 데이터를 가져오는데 실패했습니다.", error);
        toast.error("알림 데이터를 가져오는데 실패했습니다.");
      }
    };

    // 30초마다 알림 데이터를 가져옵니다.
    const intervalId = setInterval(fetchNotificationData, 30000);

    // 컴포넌트가 언마운트될 때 인터벌을 정리합니다.
    return () => clearInterval(intervalId);
  }, []);

  // NotificationContent 컴포넌트와 기존 렌더링 로직은 이제 필요 없습니다.

  return null; // 토스트 알림만을 사용하므로, 별도의 렌더링은 필요 없습니다.
}

export default Notification;
