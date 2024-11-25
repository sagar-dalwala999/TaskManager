import { useState } from "react";
import TaskModal from "./TaskModal";
import { toast } from "react-hot-toast";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const AddTask = ({ setIsModalOpen, onAddTask }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    type: "Normal",
    users: [],
  });

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
        onAddTask(response.data.data); // Callback to update the task list
        setIsModalOpen(false); // Close the modal after adding the task
      }
    } catch (error) {
      console.log("Error in adding task: ", error.message);
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
