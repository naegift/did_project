import React from "react";
import useUserAndNotifications from "../../hooks/useInboxNotifications";

interface MyNotificationBoxProps {
  showModal: boolean;
  toggleModal: () => void;
}

const MyNotificationBox: React.FC<MyNotificationBoxProps> = ({
  showModal,
  toggleModal,
}) => {
  const { inboxNotifications } = useUserAndNotifications();

  if (!showModal) {
    return null;
  }

  // 모달의 배경 클릭 시 모달 닫기
  const handleModalClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleModal();
  };

  // 모달 컨텐츠 클릭 시 이벤트 전파 방지
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      id="myNotificationModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
      onClick={handleModalClose} // 모달 배경 클릭 이벤트 추가
    >
      <div
        className="relative p-5 border w-96 shadow-lg rounded-md bg-white"
        onClick={handleModalContentClick} // 모달 컨텐츠 클릭 이벤트 추가
      >
        <div className="modal-content">
          <div id="myNotificationBox" className="mt-3 text-center">
            {inboxNotifications.map((notification, index) => (
              <div key={index} className="py-2 px-4 bg-gray-100 my-2 rounded">
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNotificationBox;
