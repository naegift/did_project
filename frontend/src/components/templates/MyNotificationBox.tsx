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

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleModalClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleModal();
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      id="myNotificationModal"
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
      onClick={handleModalClose}
    >
      <div
        className="relative p-5 border w-96 shadow-lg rounded-md bg-white"
        onClick={handleModalContentClick}
      >
        <div className="modal-content">
          <div id="myNotificationBox" className="mt-3 text-center">
            {inboxNotifications.map((notification, index) => {
              const timestampMatch =
                notification.message.match(/\[timestamp: (\d+)\]/);
              const timestamp = timestampMatch
                ? parseInt(timestampMatch[1], 10)
                : null;
              const formattedMessage = timestamp
                ? notification.message.replace(
                    /\[timestamp: \d+\]/,
                    formatTimestamp(timestamp)
                  )
                : notification.message;

              return (
                <div
                  key={index}
                  className="py-2 px-4 bg-gray-100 my-2 rounded"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {formattedMessage}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNotificationBox;
