/* eslint-disable react/prop-types */
import Toggle from "../../theme/Toggle";
import { IoLogOutOutline, IoNotificationsOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import NotificationModal from "../notification/NotificationModal";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfile from "../auth/user/UserProfile";

const Navigation = ({ user, setTheme, theme, socket }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  //* Fetch notifications
  useEffect(() => {
    if (!user.data?._id || !socket) return; // Guard clause for invalid user data or missing socket

    // Emit an event to fetch notifications when the socket is connected
    socket.emit("fetch-notifications", { userId: user.data._id });

    // Listen for notifications event
    socket.on("notifications", (notifications) => {
      setNotifications(notifications); // Store the fetched notifications
    });

    // Listen for real-time notifications
    socket.on("notification", (newNotification) => {
      console.log("Real-time notification:", newNotification);
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    });

    // Cleanup socket listeners when component unmounts
    return () => {
      socket.off("notifications");
      socket.off("notification");
      // console.log("Socket listeners removed");
    };
  }, [user.data?._id, socket]); // Ensure user data and socket are available before making socket requests

  //* Handle notifications
  const handleNotifications = () => {
    setIsNotificationOpen(true);
  };

  //* Handle mark as read
  const handleMarkAsRead = (notificationId) => {
    socket.emit("read-notification", {
      userId: user.data._id,
      notificationId: notificationId,
    });
    socket.emit("fetch-notifications", {
      userId: user.data._id,
    });

    socket.on("notifications", (notifications) => {
      setNotifications(notifications);
    });
  };

  //* Logout function
  const handleLogout = () => {
    localStorage.setItem("token", null);
    localStorage.setItem("userRole", null);
    localStorage.setItem("tasks", null);
    localStorage.setItem("persist:root", null);
    window.location.reload();
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="navbar bg-base-100 z-10">
      {/* Drawer For Small Screens */}
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost drawer-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <a className="btn btn-ghost text-xl">TBSM</a>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-auto p-4">
            <div className="flex-1">
              <li>
                <button onClick={() => window.location.reload()}>
                  Task List 
                </button>
              </li>
            </div>
            <div className="flex gap-1 flex-col mt-4 lg:hidden">
              <div className="border-t-2 border-base-300 relative p-2 ms-2">
                <button className="flex" onClick={handleNotifications}>
                  <IoNotificationsOutline size={28} className="mt-2" />
                  {notifications.length > 0 && (
                    <span className="badge badge-sm badge-primary absolute top-2 left-5">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              <div className="border-y-2 border-base-300 pb-2 ms-2">
                <Toggle theme={theme} setTheme={setTheme} />
              </div>
              <div className="border-b-2 border-base-300 pb-2 ms-2">
                <div className="dropdown dropdown-top">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      {import.meta.env.VITE_BASE_PIC_URL +
                        user?.data?.profilePic && (
                        <img
                          alt={user.data.username}
                          src={`${import.meta.env.VITE_BASE_PIC_URL}${
                            user?.data?.profilePic
                          }`}
                          onError={(e) => {
                            e.target.src = "./avatar.png";
                          }}
                        />
                      )}
                      <img src="./avatar.png" alt={`${user.data.username}`} />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="flex flex-col divide-y divide-slate-400 items-center menu menu-sm dropdown-content bg-base-300 rounded-box z-[1] shadow"
                  >
                    <li>
                      <button
                        className=""
                        onClick={() => setIsProfileOpen(true)}
                      >
                        <FaRegUserCircle className="w-7 h-6 my-1" />
                      </button>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="w-full">
                        <IoIosLogOut className="w-7 h-6 my-1" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>

      {/* Navbar Content for md and above */}
      <div className="hidden lg:flex lg:gap-4 me-6">
        <div className="dropdown">
          <button
            className="btn btn-ghost justify-between rounded-full"
            onClick={handleNotifications}
          >
            <div className="indicator relative">
              <IoNotificationsOutline size={25} className="mt-1" />
              {notifications.length > 0 && (
                <span className="badge badge-sm badge-primary absolute top-0 left-3">
                  {notifications.length}
                </span>
              )}
            </div>
          </button>
          {/* <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li className="text-sm">Notifications</li>
         </ul> */}
        </div>

        <Toggle theme={theme} setTheme={setTheme} />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt={user.data.username}
                src={`${import.meta.env.VITE_BASE_PIC_URL}${
                  user.data.profilePic
                }`}
                onError={(e) => (e.target.src = "./avatar.svg")}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="flex flex-col divide-y bg-base-300 divide-slate-500 items-center menu menu-sm dropdown-content rounded-box z-[1] mt-1 shadow"
          >
            <li className="w-full">
              <button className="" onClick={() => setIsProfileOpen(true)}>
                <FaRegUserCircle size={20} className="w-5 h-5" />
                Profile
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full">
                <IoLogOutOutline size={20} className="w-5 h-5" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Notification Modal */}
      {isNotificationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
          <NotificationModal
            notifications={notifications}
            onClose={() => setIsNotificationOpen(false)}
            handleMarkAsRead={handleMarkAsRead}
          />
        </div>
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <UserProfile onClose={() => setIsProfileOpen(false)} user={user} />
        </div>
      )}
    </div>
  );
};

export default Navigation;
