/* eslint-disable react/prop-types */
import { useState } from "react";
import TaskModal from "./TaskModal";
import { useDispatch } from "react-redux";
import { editTask } from "../../redux/slices/tasksSlice";
import { toast } from "react-hot-toast";

const EditSubTask = ({ setIsModalOpen, task, onClose }) => {
  const dispatch = useDispatch();

  // Local state for form data
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "Pending",
    type: task?.type || "Normal",
    users: task?.userId || [], // Array of user IDs
  });

  const handleEditSubTaskSubmit = async () => {
    const updatedFormData = {
      ...formData,
      userId: formData.users.map((user) => user.value), // Convert to IDs
    };

    dispatch(editTask({ data: updatedFormData, id: task?._id }))
      .unwrap()
      .then(() => {
        toast("Sub Task edited successfully");
        setIsModalOpen(false);
      })
      .catch((err) => alert("Error editing task: " + err.message));
  };

  return (
    <TaskModal
      setIsModalOpen={setIsModalOpen}
      mode="edit-subtask"
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleEditSubTaskSubmit}
      onClose={onClose}
    />
  );
};

export default EditSubTask;
