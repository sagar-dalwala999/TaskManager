/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { IoArchiveOutline } from "react-icons/io5";

const NotificationModal = ({ notifications, onClose, handleMarkAsRead }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the transition when the component is mounted
    setIsVisible(true);
    return () => setIsVisible(false); // Cleanup when unmounted
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-15 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute right-20 top-16 bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-base-content">
          Notifications
        </h3>
        {notifications.length > 0 ? (
          <ul className="space-y-3 overflow-y-auto max-h-80">
            {notifications.map((notif, index) => (
              <li
                key={index}
                className="bg-base-200 rounded-lg p-3 shadow-sm text-md flex justify-between items-center"
              >
                <span className="text-md">{notif.message}</span>
                <button
                  className="btn btn-md btn-ghost btn-square flex items-center justify-center"
                  onClick={() => handleMarkAsRead(notifications[index]._id)}
                >
                  <IoArchiveOutline className="w-5 h-5 text-error" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-center text-gray-500">
            No notifications yet
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
