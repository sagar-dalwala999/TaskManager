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
  const socketRef = useRef(null);

  const fetchLoggedInUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:3000/api/v1/auth/get-user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${JSON.parse(token)}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        const userData = response.data;
        setUser(userData);

        if (socketRef.current && !socketRef.current.hasListeners("register")) {
          socketRef.current.emit("register", {
            userId: userData.data._id,
            userRole: userData.data.role,
          });
          console.log("User registered:", userData.data._id, userData.data.role);
        }
      } else {
        console.error("Failed to fetch user data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching logged-in user:", error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to the server:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    fetchLoggedInUser();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  const openDrawer = (task) => setSelectedTask(task);
  const closeDrawer = () => setSelectedTask(null);

  return (
    <div className="h-screen flex flex-col">
      <div className="fixed w-full z-10">
        {user && (
          <Navigation
            setTheme={setTheme}
            theme={theme}
            user={user}
            socket={socketRef.current} // Pass socket to Navigation
          />
        )}
      </div>

      <div className="flex-grow mt-16 p-4">
        <Tasks onTaskClick={openDrawer} user={user} />
      </div>

      {selectedTask && (
        <TasksDrawer task={selectedTask} user={user} closeDrawer={closeDrawer} />
      )}
    </div>
  );
};

export default DashBoard;
