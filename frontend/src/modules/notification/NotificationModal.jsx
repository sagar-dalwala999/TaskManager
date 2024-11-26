import { IoArchiveOutline } from "react-icons/io5";
/* eslint-disable react/prop-types */
const NotificationModal = ({ notifications, onClose, handleMarkAsRead }) => {

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md"
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
                  className="btn btn-xs btn-ghost btn-circle w-9 h-9 flex items-center justify-center"
                  onClick={() => handleMarkAsRead(notifications[index]._id)}
                >
                  <IoArchiveOutline className="w-5 h-5 text-white" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-center text-gray-500">
            No notifications yet
          </p>
        )}

        {/* <div className="flex justify-end">
          <button className="btn btn-sm btn-primary mt-4" onClick={onClose}>
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default NotificationModal;
