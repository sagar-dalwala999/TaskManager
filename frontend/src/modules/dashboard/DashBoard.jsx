import { useState, useEffect, useRef } from "react";
import Tasks from "../tasks/Tasks";
import Navigation from "../navigation/Navigation";
import TasksDrawer from "../taskDrawer/TasksDrawer";
import axios from "axios";
import { io } from "socket.io-client";

// eslint-disable-next-line react/prop-types
const DashBoard = ({ setTheme, theme }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [user, setUser] = useState(null);
  const socketRef = useRef(null); // Ref to store the socket instance

  // Fetch logged-in user details
  const fetchLoggedInUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/auth/get-user`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(token)}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const userData = response.data; // Store the user details

        setUser(userData);

        // Emit the 'register' event only after fetching the user
        if (socketRef.current) {
          socketRef.current.emit("register", {
            userId: userData.data._id, // Make sure `id` matches the server-side field
            userRole: userData.data.role, // Ensure this matches the expected key on the server
          });
          console.log("User registered:", userData.id, userData.role);
        }
      } else {
        console.error("Failed to fetch user data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching logged-in user:", error.message);
      if (error.response?.status === 401) {
        // Token invalid or expired, clear local storage
        localStorage.removeItem("token");
        setUser(null);
        // Redirect to login (optional)
      }
    }
  };

  useEffect(() => {
    fetchLoggedInUser(); // Fetch the logged-in user when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true, // Ensure credentials are sent with each request
    });

    // Listen for socket connection and registration
    socketRef.current.on("connect", () => {
      console.log("Connected to the server:", socketRef.current.id);
    });

    socketRef.current.on("register", (data) => {
      console.log("User registered:", data);
      // Handle any other necessary actions after registration, e.g. notifications
    });

    // Cleanup socket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  const openDrawer = (task) => setSelectedTask(task);

  const closeDrawer = () => setSelectedTask(null);

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Bar */}
      <div className="fixed w-full z-10">
        {user && <Navigation setTheme={setTheme} theme={theme} user={user} />}
      </div>

      {/* Main Tasks Section */}
      <div className="flex-grow mt-16 p-4">
        <Tasks onTaskClick={openDrawer} user={user} />
      </div>

      {/* Task Details Drawer */}
      {selectedTask && (
        <TasksDrawer task={selectedTask} user={user} closeDrawer={closeDrawer} />
      )}
    </div>
  );
};

export default DashBoard;
