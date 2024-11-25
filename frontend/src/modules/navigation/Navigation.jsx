/* eslint-disable react/prop-types */
import Toggle from "../../theme/Toggle";
import { IoLogOutOutline, IoNotificationsOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import NotificationModal from "../notification/NotificationModal";
import { IoIosLogOut } from "react-icons/io";
import { io } from "socket.io-client";

const Navigation = ({ user, setTheme, theme }) => {
  // Function to handle logout
  const handleLogout = () => {
    localStorage.setItem("token", null);
    localStorage.setItem("userRole", null);
    localStorage.setItem("tasks", null);
    localStorage.setItem("persist:root", null);
    window.location.reload();
  };

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Connect to the socket
    const socket = io("http://localhost:3000", {
      withCredentials: true,
    });

    // Register the user to fetch notifications
    socket.emit("register", {
      userId: user.data._id,
      userRole: user.data.role,
    });

    // Listen for stored notifications
    socket.on("notifications", (storedNotifications) => {
      console.log("Received notifications:", storedNotifications); // Debugging
      setNotifications(storedNotifications);
    });

    // Fetch notifications
    socket.emit("fetch-notifications", {
      userId: user.data._id,
    });

    // Listen for real-time notifications
    socket.on("notifications", (newNotification) => {
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
    });

    return () => {
      // Clean up the socket connection
      socket.on("disconnect", () => {
        socket.disconnect();
      });
    };
  }, [user.data._id, user.data.role]);

  return (
    <div className="navbar bg-base-100 z-10">
      {/* Drawer for mobile */}
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center">
          {/* Hamburger Menu */}
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
              ></path>
            </svg>
          </label>
          <a className="btn btn-ghost text-xl">TBSM</a>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-auto p-4">
            {/* Sidebar Content */}
            <div className="flex-1">
              <li>
                <button onClick={() => window.location.reload()}>
                  Dashboard
                </button>
              </li>
              {/* <li>
                <button>Add Task</button>
              </li> */}
              {/*
                <li>
                <button
                  className="flex btn btn-ghost justify-between"
                  onClick={() => setIsNotificationOpen(true)}
                >
                  {/* <IoNotificationsOutline size={16} className="" /> */}
              {/* Notifications
                  <span className="badge badge-primary badge-sm ">1</span>
                </button>
              </li> */}
            </div>
            {/* Theme Toggle and Profile in Drawer */}
            <div className="flex gap-1 flex-col mt-4 lg:hidden">
              <div className="border-t-2 border-base-300 relative p-2 ms-2">
                <button
                  className="flex"
                  onClick={() => setIsNotificationOpen(true)}
                >
                  <IoNotificationsOutline size={28} className="mt-2" />
                  {notifications.length > 0 && (
                    <span className="badge badge-sm badge-primary absolute top-2 left-5">
                      {notifications.length > 0 && notifications.length}
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
                          src={`
                          ${import.meta.env.VITE_BASE_PIC_URL}${
                            user?.data?.profilePic
                          }`}
                        />
                      )}
                      <img src="./avatar.png" alt={`${user.data.username}`} />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-primary text-white rounded-box z-[1] mt-1 shadow"
                  >
                    <li>
                      <button onClick={handleLogout} className="w-full">
                        <IoIosLogOut className="w-5 h-5" />
                        {/* Logout */}
                      </button>
                    </li>
                    {/* <li>
                      <button className="justify-between">Profile</button>
                    </li>
                    <li>
                      <button>Settings</button>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>

      {/* Navbar Content for md and above */}
      <div className="hidden lg:flex lg:gap-4 me-6">
        {/* Notifications */}
        <button
          className="btn btn-ghost justify-between rounded-full"
          onClick={() => setIsNotificationOpen(true)}
        >
          <div className="indicator relative">
            <IoNotificationsOutline size={25} className="mt-1" />
            {notifications.length > 0 && (
              <span className="badge badge-sm badge-primary absolute top-0 left-3">
                {notifications.length > 0 && notifications.length}
              </span>
            )}
          </div>
        </button>
        {/* Theme Toggle for Desktop */}
        <Toggle theme={theme} setTheme={setTheme} />
        {/* Profile Picture */}
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
                className=""
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-primary text-white rounded-box z-[1] mt-1 shadow"
          >
            <li>
              <button onClick={handleLogout} className="w-full">
                <IoLogOutOutline size={20} className="w-5 h-5" />
                Logout
              </button>
            </li>
            {/* <li>
              <button className="justify-between">Profile</button>
            </li>
            <li>
              <button>Settings</button>
            </li> */}
          </ul>
        </div>
      </div>

      {/* Notification Modal */}
      {isNotificationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <NotificationModal
            notifications={notifications}
            onClose={() => {
              setIsNotificationOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Navigation;
