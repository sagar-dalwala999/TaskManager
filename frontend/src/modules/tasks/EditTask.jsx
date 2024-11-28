/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import TaskModal from "./TaskModal";
import { io } from "socket.io-client";

const EditTask = ({ setIsModalOpen, task, onClose }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "Pending",
    type: task?.type || "Normal",
    users: [], // Will be populated later with mapped data
  });

  const [socket, setSocket] = useState(null);

  // Map task.userId to formData.users
  useEffect(() => {
    if (task?.userId?.length) {
      const mappedUsers = task.userId.map((user) => ({
        value: user._id,
        label: user.email,
      }));
      setFormData((prev) => ({ ...prev, users: mappedUsers }));
    }
  }, [task]);

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

  const handleEditTaskSubmit = async () => {
    try {
      const updatedFormData = {
        ...formData,
        userId: formData.users.map((user) => user.value), // Convert to IDs
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/edit/${task?._id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        // Emit the task-updated event via Socket.IO
        if (socket) {
          socket.emit("task-updated", response.data.data);
        }

        toast.success("Task updated successfully!");
        window.location.href = "/"; // Redirect after success
        setIsModalOpen(false); // Close the modal
      }
    } catch (error) {
      toast.error("Failed to update the task.");
      console.error("Error updating task:", error.message);
    }
  };

  return (
    <TaskModal
      setIsModalOpen={setIsModalOpen}
      mode="edit"
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleEditTaskSubmit}
      onClose={onClose}
    />
  );
};

export default EditTask;
