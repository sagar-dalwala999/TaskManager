import toast from "react-hot-toast";
import axios from "axios";
import DeleteModal from "../tasks/modal/DeleteModal";

// eslint-disable-next-line react/prop-types
const DeleteSubTask = ({ setIsModalOpen, onClose, subtask }) => {
  const handleDeleteSubTaskSubmit = async () => {
    try {
      const response = await axios.delete(
        // eslint-disable-next-line react/prop-types
        `http://localhost:3000/api/v1/tasks/subtask/delete/${subtask?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`, // Ensure the token is available in localStorage
          },
        }
      );

      if (response.status === 200) {
        toast.success("Subtask deleted successfully!");
        setIsModalOpen(false);
        // You can also trigger an update in the parent component to refresh the subtask list.
        window.location.href = "/";
      } else {
        toast.error("Failed to delete subtask. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast.error("An error occurred while deleting the subtask.");
    }
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
