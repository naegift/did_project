import React, { useEffect, useState } from "react";
import { NotificationItem } from "@pushprotocol/uiweb";
import "../../styles/notification.css";

const NotificationContent = ({ data }: { data: any }) => {
  const [visible, setVisible] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setVisible(false);
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, []);

  if (!visible) return null;

  const notificationTitle = data.message.payload.title || "알림";
  const notificationBody = data.message.payload.body || "내용이 없습니다.";

  return (
    <div>
      <NotificationItem
        notificationTitle={notificationTitle}
        notificationBody={notificationBody}
        chainName={"ETH_TEST_SEPOLIA"}
        icon={""}
        app={"TEST"}
        cta={"자세히 보기"}
        image={"이미지_URL"}
        url={"알림_링크_URL"}
      />
      {/* <div
        className="progress-bar"
        style={{ animation: "shrink 5s linear" }}
      ></div> */}
    </div>
  );
};

function Notification({ notificationData }: { notificationData: any[] }) {
  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
      {notificationData.map((data, index) => (
        <div key={index} className="w-72 text-white rounded-lg mb-4 shadow-lg">
          <NotificationContent data={data} />
        </div>
      ))}
    </div>
  );
}

export default Notification;
