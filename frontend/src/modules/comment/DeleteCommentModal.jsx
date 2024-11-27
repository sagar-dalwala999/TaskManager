import toast from "react-hot-toast";
import axios from "axios";

/* eslint-disable react/prop-types */
const DeleteCommentModal = ({ onClose, commentId }) => {
  console.log(commentId);
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/v1/comments/delete/${commentId}`,
        {
          headers: {
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        // Update the comments state by filtering out the deleted comment
        // setComments((prevComments) =>
        //   prevComments.filter((comment) => comment._id !== commentId)
        // );
        window.location.reload();
        toast.success("Comment deleted successfully!");
        onClose(); // Close the modal after deletion
      }
    } catch (error) {
      toast.error("Error deleting the comment.");
      console.log("Error deleting the comment: ", error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-base-content">
          Delete Comment
        </h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold text-base-content">
              Are you sure you want to delete this comment?
            </label>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-3">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommentModal;
