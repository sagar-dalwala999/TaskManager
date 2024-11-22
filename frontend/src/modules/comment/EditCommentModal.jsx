import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  editComment,
  fetchSingleComment,
} from "../../redux/slices/commentsSlice";
import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
const EditCommentModal = ({ onClose, commentId }) => {
  const [formData, setFormData] = useState({
    text: "",
    image: "",
  });

  const dispatch = useDispatch();

  const { comment } = useSelector((state) => state.comments);

  console.log(comment?.data.text);

  useEffect(() => {
    dispatch(fetchSingleComment(commentId))
      .unwrap()
      .then((response) => {
        if (response.status === "success") {
          toast.success("Comments fetched successfully!");
        }
      })
      .catch((error) => {
        toast.error("Error fetching comments: " + error.message);
      });
    }, [dispatch, commentId]);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(editComment({ id: commentId, data: formData }))
      .unwrap()
      .then(() => {
        onClose();
        window.location.reload();
        toast.success("Comment edited successfully!");
        setFormData({ text: comment?.data?.text, image: "" });
      })
      .catch((err) => alert("Error editing comment: " + err.message));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log(commentId);
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
          Edit Comment
        </h3>
        <div className="flex flex-col gap-4">
          {/* Edit Comment */}
          <div>
            <label className="block font-semibold text-base-content"></label>
            <input
              type="text"
              name="text"
              value={formData.text || comment?.data?.text}  // Use formData or the fetched comment text
              onChange={handleChange}  // Update formData.text on change
              placeholder="Edit Comment"
              className="input input-bordered w-full mt-4"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {"Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCommentModal;
