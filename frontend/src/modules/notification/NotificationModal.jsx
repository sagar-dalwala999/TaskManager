import { AiOutlineDelete } from "react-icons/ai";

/* eslint-disable react/prop-types */
const NotificationModal = ({ notifications, onClose }) => {
  const handleMarkAsRead = (index) => {
    console.log("Mark as read:", notifications[index]);
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-base-content">
          Notifications
        </h3>
        {notifications.length > 0 ? (
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className="bg-base-300 rounded-lg p-3 shadow-sm text-md flex justify-between items-center"
              >
                <span className="text-md">{notif.message}</span>
                <button
                  className="btn btn-xs btn-error w-8 h-8 flex items-center justify-center"
                  onClick={() => handleMarkAsRead(index)}
                >
                  <AiOutlineDelete className="w-4 h-4 text-base-300" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">No notifications yet</p>
        )}

        <div className="flex justify-end">
          <button className="btn btn-sm btn-primary mt-4" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
