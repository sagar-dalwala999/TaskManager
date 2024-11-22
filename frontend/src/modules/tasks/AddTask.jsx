/* eslint-disable react/prop-types */
import { useState } from "react";
import TaskModal from "./TaskModal";
import { useDispatch } from "react-redux";
import { addTask } from "../../redux/slices/tasksSlice";
import { toast } from "react-hot-toast";

const AddTask = ({ setIsModalOpen }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    type: "Normal",
    users: [],
  });

  const handleSubmit = () => {
    if (formData.title && formData.description && formData.users.length > 0) {
      // Only send user IDs (not the full object with value/label)
      const userIds = formData.users.map((user) => user.value);

      dispatch(
        addTask({
          ...formData,
          userId: userIds,  // send only the user IDs
        })
      )
        .unwrap()
        .then(() => {
          toast("Task added successfully");
          setIsModalOpen(false);
        })
        .catch((err) => alert("Error adding task: " + err.message));

      console.log(formData); // Verify the form data before sending
    } else {
      toast("Please fill in all required fields");
    }
  };

  return (
    <>
      <TaskModal
        onClose={() => setIsModalOpen(false)}
        mode="add"
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default AddTask;
