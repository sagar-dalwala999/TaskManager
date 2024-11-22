/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { editTask } from "../../redux/slices/tasksSlice";
import TaskModal from "./TaskModal";
import { useDispatch } from "react-redux";

const EditTask = ({ setIsModalOpen, task, onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "Pending",
    type: task?.type || "Normal",
    users: task?.userId || [], // Array of user IDs
  });

  const handleEditTaskSubmit = async () => {
    const updatedFormData = {
      ...formData,
      userId: formData.users.map((user) => user.value), // Convert to IDs
    };

    dispatch(editTask({ data: updatedFormData, id: task?._id }))
      .unwrap()
      .then(() => {
        toast("Task edited successfully");
        setIsModalOpen(false);
      })
      .catch((err) => alert("Error editing task: " + err.message));
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
