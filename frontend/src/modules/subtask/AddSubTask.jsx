import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

import TaskModal from "../tasks/TaskModal";

// eslint-disable-next-line react/prop-types
const AddSubTask = ({ setIsModalOpen, task, userOptions }) => {
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

  const handleAddSubTaskSubmit = async () => {
    if (
      !formData.title ||
      !formData.description ||
      formData.users.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await axios.post(
        // eslint-disable-next-line react/prop-types
        `http://localhost:3000/api/v1/tasks/subtask/create/${task?._id}`,
        {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          type: formData.type,
          userId: formData.users.map((user) => user.value),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Subtask added successfully!");
        // Pass the new subtask to update the list in the parent
        // updateSubtasks(response.data.data); // Assuming response contains the new subtask

        // Emit the task-created event via Socket.IO
        if (socket) {
          socket.emit("subtask-created", { subtask: response.data.data });
        }

        window.location.href = "/";
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          status: "Pending",
          type: "Normal",
          users: [],
        });
      } else {
        toast.error("Failed to add subtask. Please try again.");
      }
    } catch (error) {
      console.error("Error adding subtask:", error);
      toast.error("An error occurred while adding the subtask.");
    }
  };

  return (
    <TaskModal
      setIsModalOpen={setIsModalOpen}
      task={task}
      mode="subtask"
      handleSubmit={handleAddSubTaskSubmit}
      onClose={() => setIsModalOpen(false)}
      formData={formData}
      setFormData={setFormData}
      userOptionsForSubtask={userOptions}
    />
  );
};

export default AddSubTask;
