/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import TaskModal from "../tasks/TaskModal";

const EditSubTask = ({ setIsModalOpen, subtask, onClose, userOptions }) => {
  // Local state for form data
  const [formData, setFormData] = useState({
    title: subtask?.title || "",
    description: subtask?.description || "",
    status: subtask?.status || "Pending",
    type: subtask?.type || "Normal",
    users: subtask?.userId || [], // Array of user IDs
  });

  const handleEditSubTaskSubmit = async () => {
    const updatedFormData = {
      ...formData,
      userId: formData.users.map((user) => user.value), // Convert to IDs
    };

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/tasks/subtask/edit/${subtask?._id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Subtask edited successfully");
        window.location.href = "/";
        // Pass the updated subtask to the parent component
        // updateSubtasks(response.data.data); // Update the subtask in the parent component

        onClose(); // Close the modal after successful update
      } else {
        toast.error("Failed to edit subtask. Please try again.");
      }
    } catch (error) {
      console.error("Error editing subtask:", error);
      toast.error("An error occurred while editing the subtask.");
    }
  };

  return (
    <TaskModal
      setIsModalOpen={setIsModalOpen}
      mode="edit-subtask"
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleEditSubTaskSubmit}
      onClose={onClose}
      userOptionsForSubtask={userOptions}
    />
  );
};

export default EditSubTask;
