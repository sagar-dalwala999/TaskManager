/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import DeleteModal from "./DeleteModal";
import { deleteTask } from "../../redux/slices/tasksSlice";
import toast from "react-hot-toast";

const DeleteSubTask = ({ subtask, setIsModalOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleDeleteSubTaskSubmit = async () => {
    
    dispatch(deleteTask(subtask?._id))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        toast.success("Task Deleted Successfully");
      })
      .catch((err) => alert("Error deleting task: " + err.message));
  };
  return (
    <DeleteModal
      setIsModalOpen={setIsModalOpen}
      mode={"subtask"}
      onClose={onClose}
      handleSubmit={handleDeleteSubTaskSubmit}
    />
  );
};

export default DeleteSubTask;
