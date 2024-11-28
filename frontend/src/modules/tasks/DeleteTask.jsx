/* eslint-disable react/prop-types */

import axios from "axios";
import toast from "react-hot-toast";
import DeleteModal from "./modal/DeleteModal";

const DeleteTask = ({ task, setIsModalOpen, onClose }) => {
  const handleDeleteTaskSubmit = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/delete/${task?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        toast.success("Task deleted successfully!");
        setIsModalOpen(false);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      toast.error("Failed to delete the task.");
    }
  };

  return (
    <DeleteModal
      setIsModalOpen={setIsModalOpen}
      mode={"task"}
      onClose={onClose}
      handleSubmit={handleDeleteTaskSubmit}
    />
  );
};

export default DeleteTask;
