import React from "react";
import { NotificationItem } from "@pushprotocol/uiweb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../public/css/custom-toast.css";

function Notification({ notificationData }) {
  const notify = () =>
    toast(<NotificationContent data={notificationData} />, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  React.useEffect(() => {
    if (notificationData) {
      notify();
    }
  }, [notificationData]);

  return (
    <>
      <ToastContainer />
    </>
  );
}

const NotificationContent = () => (
  <NotificationItem
    notificationTitle={"상품 전송 완료"}
    notificationBody={
      "구매하신 상품이 정상적으로 전달되었습니다. \n [timestamp: 1699347011]"
    }
    chainName={"ETH_TEST_SEPOLIA"}
    icon={"image/logo.png"}
    app={"NAEGIFT"}
  />
);

export default Notification;
