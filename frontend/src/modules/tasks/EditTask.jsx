/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import TaskModal from "./TaskModal";

const EditTask = ({ setIsModalOpen, task, onClose }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "Pending",
    type: task?.type || "Normal",
    users: [], // Initialize empty array for user options
  });

  const [userOptions, setUserOptions] = useState([]); // State for user options

  // Fetch users from API
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/get-all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
            },
          }
        );

        if (response?.status === 200) {
          const options = response.data.data.map((user) => ({
            value: user._id,
            label: user.email,
          }));
          setUserOptions(options); // Set user options
          setFormData((prev) => ({
            ...prev,
            users: task?.userId?.map((id) =>
              options.find((option) => option.value === id)
            ) || [], // Map task user IDs to options
          }));
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
        toast.error("Failed to fetch users.");
      }
    };
    fetchAllUsers();
  }, [task?.userId]);

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
        toast.success("Task updated successfully!");
        window.location.href = "/";
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
      userOptions={userOptions} // Pass user options to the modal
    />
  );
};

export default EditTask;
