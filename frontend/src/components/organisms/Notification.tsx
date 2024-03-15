import React, { useEffect, useState } from "react";
import { NotificationItem } from "@pushprotocol/uiweb";
import "../../styles/notification.css";

const NotificationContent = ({ data }: { data: any }) => {
  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = () => {
    if (!visible) {
      setShouldRender(false);
    }
  };

  if (!shouldRender) return null;

  const notificationTitle = data.message.payload.title || "알림";
  const notificationBody = data.message.payload.body || "내용이 없습니다.";
  const containerClasses = `notification-container ${
    visible ? "slide-in-right" : "slide-out-right"
  }`;

  const progressBarClasses = "progress-bar";
  return (
    <div className={containerClasses} onAnimationEnd={handleAnimationEnd}>
      <NotificationItem
        notificationTitle={notificationTitle}
        notificationBody={notificationBody}
        chainName={"ETH_TEST_SEPOLIA"}
        icon={""}
        app={"NAEGIFT"}
        cta={""}
        image={""}
        url={""}
      />
      <div className={progressBarClasses}></div>
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
