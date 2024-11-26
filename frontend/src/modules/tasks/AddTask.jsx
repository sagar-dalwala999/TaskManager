import { useState, useEffect } from "react";
import TaskModal from "./TaskModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";

// eslint-disable-next-line react/prop-types
const AddTask = ({ setIsModalOpen, onAddTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    type: "Normal",
    users: [],
  });
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
    setSocket(socketInstance);

    // Listen for notifications
    socketInstance.on("notification", (notification) => {
      toast.success(notification.message); // Show notification as a toast
      console.log("Received notification:", notification);
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSubmit = async () => {
    const { title, description, users } = formData;

    if (!title || !description || users.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create a task object
    const newTask = {
      ...formData,
      userId: users.map((user) => user.value),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/create`,
        newTask,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Task added successfully");

        // Emit the task-created event via Socket.IO
        if (socket) {
          socket.emit("task-created", response.data.data);
        }

        // Callback to update the task list
        onAddTask(response.data.data);

        // Close the modal after adding the task
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error in adding task: ", error.message);
      toast.error("Failed to add task.");
    }
  };

  return (
    <TaskModal
      onClose={() => setIsModalOpen(false)}
      mode="add"
      handleSubmit={handleSubmit}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default AddTask;
