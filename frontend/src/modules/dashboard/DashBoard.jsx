import { useState, useEffect } from "react";
import Tasks from "../tasks/Tasks";
import Navigation from "../navigation/Navigation";
import TasksDrawer from "../taskDrawer/TasksDrawer";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const DashBoard = ({ setTheme, theme }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [user, setUser] = useState(null);

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
        setUser(response.data); // Store user details
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
    fetchLoggedInUser();
  }, []);

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
