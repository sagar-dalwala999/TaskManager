import { useState, useEffect, useRef } from "react";
import Tasks from "../tasks/Tasks";
import Navigation from "../navigation/Navigation";
import TasksDrawer from "../taskDrawer/TasksDrawer";
import axios from "axios";
import { io } from "socket.io-client";
import { TbListDetails } from "react-icons/tb";
import { MdOutlineLeaderboard } from "react-icons/md";
import TasksBoard from "../tasks/TasksBoard";

// eslint-disable-next-line react/prop-types
const DashBoard = ({ setTheme, theme }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);
  const [taskList, setTaskList] = useState(true);
  const [taskBoard, setTaskBoard] = useState(false);

  const fetchLoggedInUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/get-user",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(token)}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const userData = response.data;
        setUser(userData);

        if (socketRef.current && !socketRef.current.hasListeners("register")) {
          socketRef.current.emit("register", {
            userId: userData.data._id,
            userRole: userData.data.role,
          });
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

  //* Socket
  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {});

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    fetchLoggedInUser();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
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
      <div className="flex flex-col mt-16 p-4">
        <div className="flex gap-4">
          <button
            className={`flex items-center gap-2 ms-2 mb-4 cursor-pointer ${
              taskList ? "text-primary border-b border-gray-400" : ""
            } `}
            onClick={() => {
              setTaskList(true);
              setTaskBoard(false);
            }}
          >
            <TbListDetails />
            <h4 className={`text-md font-bold`}>List</h4>
          </button>
          <button
            className={`flex items-center gap-2 ms-2 mb-4 cursor-pointer ${
              taskBoard ? "text-primary border-b border-gray-400" : ""
            }`}
            onClick={() => {
              setTaskBoard(!taskBoard);
              setTaskList(false);
            }}
          >
            <MdOutlineLeaderboard />
            <h4 className="text-md font-bold">Dashboard</h4>
          </button>
        </div>
        {taskList && <Tasks onTaskClick={openDrawer} user={user} />}
        {taskBoard && <TasksBoard onTaskClick={openDrawer} user={user} />}
      </div>

      {selectedTask && (
        <TasksDrawer
          task={selectedTask}
          user={user}
          closeDrawer={closeDrawer}
        />
      )}
    </div>
  );
};

export default DashBoard;
