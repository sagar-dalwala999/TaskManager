import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const EditCommentModal = ({ onClose, commentId, setComments }) => {
  const [editFormData, setEditFormData] = useState({
    text: "",
    image: null,
  });

  // Fetch comment to edit
  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/comments/comment/${commentId}`,
          {
            headers: {
              Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
            },
          }
        );

        if (response.status === 200 && response.data.success) {
          setEditFormData({
            text: response.data.data.text,
            image: null, // Assuming image cannot be edited
          });
        }
      } catch (error) {
        toast.error("Error fetching comment data");
        console.log("Error fetching comment data: ", error.message);
      }
    };

    fetchComment();
  }, [commentId]);

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "image" && files?.[0] ? files[0] : value,
    });
  };

  const handleEditComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/comments/edit/${commentId}`,
        editFormData,
        {
          headers: {
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        // Update the comment in the comments state
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, text: editFormData.text } // Update only the edited fields
              : comment
          )
        );
        toast.success("Comment updated successfully!");
        onClose();
      }
    } catch (error) {
      toast.error("Error updating the comment.");
      console.log("Error updating the comment: ", error.message);
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
        <h3 className="text-xl font-bold mb-4 text-base-content">Edit Comment</h3>
        <div className="flex flex-col gap-4">
          <textarea
            name="text"
            className="textarea textarea-bordered w-full"
            placeholder="Edit Comment"
            rows="3"
            value={editFormData.text}
            onChange={handleEditChange}
          ></textarea>
        </div>
          <div className="flex justify-end mt-6 gap-3">
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleEditComment}>
              Save Changes
            </button>
          </div>
      </div>
    </div>
  );
};

export default EditCommentModal;