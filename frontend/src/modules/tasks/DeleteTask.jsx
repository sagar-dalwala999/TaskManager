import { useDispatch } from "react-redux";
import DeleteModal from "./DeleteModal";
import { deleteTask } from "../../redux/slices/tasksSlice";
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
const DeleteTask = ({ task, setIsModalOpen, onClose }) => {
  const dispatch = useDispatch();

  const handleDeleteTaskSubmit = async () => {
    // eslint-disable-next-line react/prop-types
    dispatch(deleteTask(task?._id))
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
      mode={"task"}
      onClose={onClose}
      handleSubmit={handleDeleteTaskSubmit}
    />
  );
};

export default DeleteTask;
