/* eslint-disable react/prop-types */

import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { deleteComment } from "../../redux/slices/commentsSlice";


const DeleteCommentModal = ({ onClose,commentId }) => {

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    dispatch(deleteComment(commentId))
      .unwrap()
      .then(() => {
        onClose();
        toast.success("Comment deleted successfully!");
        window.location.reload(); // remove this line 
      })
      .catch((err) => alert("Error deleting comment: " + err.message));
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
        {/* Title */}
        <div>
          <label className="block font-semibold text-base-content">
            Are You Sure You Want To Delete{" "}
            <span className="text-error">Comment</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-3">
        <button className="btn btn-outline" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn-error" onClick={handleSubmit}>
          Delete
        </button>
      </div>
    </div>
  </div>
  )
}

export default DeleteCommentModal
