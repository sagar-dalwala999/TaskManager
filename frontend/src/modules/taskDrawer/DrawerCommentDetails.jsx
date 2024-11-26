import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DeleteCommentModal from "../comment/DeleteCommentModal";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { FaPlus } from "react-icons/fa6";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

// eslint-disable-next-line react/prop-types
const DrawerCommentDetails = ({ user, task }) => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({}); // Track users' details by userId
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
    useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null); // Separate ID for delete modal
  const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
  const [editFormData, setEditFormData] = useState("");
  const [socket, setSocket] = useState(null);

  const [isExpanded, setIsExpanded] = useState(true); // State for dropdown toggle

  const [data, setData] = useState({ text: "", image: null });
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line react/prop-types
  const taskId = task?._id;

  // Create a reference to the file input
  const fileInputRef = useRef();

  const handleIconClick = () => {
    fileInputRef.current.click(); // Programmatically trigger the file input
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Validate file type/size here
      setData({ ...data, image: file });
      toast.success("Image attached!");
    }
  };

  // Function to fetch comments
  const fetchComments = async () => {
    if (!taskId) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/comments/all/${taskId}`,
        {
          headers: {
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );
      if (response.status === 200 && response.data.success) {
        setComments(response.data.data);
        fetchUsers(response.data.data); // Fetch users after getting comments
      }
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  // Fetch user details based on comment userId
  const fetchUsers = async (comments) => {
    const userIds = comments.map((comment) => comment.userId);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/auth/get-users-id?ids=${userIds.join(
          ","
        )}`,
        {
          headers: {
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );
      if (response.status === 200 && response.data.success) {
        const usersMap = response.data.data.reduce((acc, user) => {
          // eslint-disable-next-line react/prop-types
          acc[user._id] = user;
          return acc;
        }, {});
        setUsers(usersMap); // Save users details by userId
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  //* Initialize Socket.IO connection
  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
    setSocket(socketInstance);

    // Listen for notifications
    socketInstance.on("notification", (notification) => {
      toast.success(notification.message); // Show notification as a toast
      console.log("Received notification:", notification);
    });

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  //* Handle form submission to add a comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!data.text.trim()) return; // Don't allow empty comments

    if (!data.text.trim() && !data.image) {
      return;
    }

    const formData = new FormData();
    formData.append("text", data.text);
    if (data.image) formData.append("image", data.image);

    setLoading(true);

    try {
      const response = await axios.post(
        // eslint-disable-next-line react/prop-types
        `http://localhost:3000/api/v1/comments/create/${taskId}/${user?.data?._id}`,
        formData,
        {
          headers: {
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setData({ text: "", image: null }); // Clear the input fields
        fetchComments(); // Refresh comments list
        toast.success("Comment added successfully!");

        // eslint-disable-next-line react/prop-types
        const usersId = task?.userId.filter((id) => id !== user?.data?._id);

        // eslint-disable-next-line react/prop-types
        const authorId = user?.data?._id;

        console.log("authorId:", authorId);
        console.log("usersId:", usersId);

        // Emit the task-created event via Socket.IO
        if (socket) {
          socket.emit("comment-created", {
            comment: response.data.data,
            usersId: usersId,
            authorId: authorId,
          });
        }
      } else {
        toast.error("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error.message);
      toast.error("An error occurred while adding the comment.");
    } finally {
      setLoading(false);
    }
  };

  //* Edit Comment
  const handleEditComment = async (e, commentId) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/v1/comments/edit/${commentId}`,
        { text: editFormData },
        {
          headers: {
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        toast.success("Comment updated successfully!");
        setComments((prev) =>
          prev.map((comment) =>
            comment._id === commentId
              ? { ...comment, text: editFormData }
              : comment
          )
        );
        setEditingCommentId(null);
      }
    } catch (error) {
      toast.error("Error updating the comment.");
      console.error("Error updating the comment:", error.message);
    }
  };

  // Handle opening the delete modal
  const openDeleteCommentModal = (commentId) => {
    setDeleteCommentId(commentId); // Set the comment ID for deletion
    setIsDeleteCommentModalOpen(true); // Open the delete modal
  };

  const renderComments = () => {
    if (!comments.length) {
      return <p className="text-sm text-gray-500">No comments yet</p>;
    }

    return comments.map((comment) => {
      const userDetail = users[comment.userId]; // Get the user details from the `users` state
      const isEditing = editingCommentId === comment._id;

      return (
        <div
          key={comment._id}
          className={`flex items-start space-x-2 bg-base-200 p-2 rounded-lg
            `}
        >
          <img
            src={`http://localhost:3000${userDetail?.profilePic}`}
            alt="User Avatar"
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
            onError={(e) => {
              e.target.src = "./avatar.svg";
            }}
          />
          <div className="flex-grow">
            <div>
              <p className="text-sm font-medium">
                {userDetail?.username}{" "}
                <span className="text-gray-400 text-xs ml-2">
                  {new Date(comment.createdAt).toLocaleDateString("en-CA")}
                </span>
              </p>

              {isEditing ? (
                <div>
                  <textarea
                    value={editFormData}
                    onChange={(e) => setEditFormData(e.target.value)}
                    className="textarea textarea-bordered input-sm w-full mt-1"
                  />
                  <div className="flex justify-end mt-1 space-x-2">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setEditingCommentId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => handleEditComment(e, comment._id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{comment.text}</p>
              )}

              {/* If image exists, display it */}
              {comment.image && (
                <img
                  src={`http://localhost:3000${comment.image}`}
                  alt="Comment Image"
                  className="w-full mt-2 rounded-md"
                  onError={(e) => {
                    e.target.src = "./avatar.svg";
                  }}
                />
              )}
            </div>
          </div>

          {/*eslint-disable-next-line react/prop-types */}
          {!isEditing && user?.data?._id === comment.userId && (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-xs">
                ⋮
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box w-32 shadow z-10"
              >
                <li>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditFormData(comment.text);
                      console.log(comment._id);
                    }}
                  >
                    Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      openDeleteCommentModal(comment._id);
                    }}
                  >
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      );
    });
  };

  useEffect(() => {
    fetchComments(); // Fetch comments when the component mounts or taskId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return (
    <div className="mt-4 me-4">
      <div onClick={() => setIsExpanded(!isExpanded)}>
        <h3
          className="flex items-center cursor-pointer text-md font-semibold mb-2 tooltip tooltip-left"
          data-tip="Comments"
        >
          {isExpanded ? (
            <IoMdArrowDropup className="w-6 h-6" />
          ) : (
            <IoMdArrowDropdown className="w-6 h-6" />
          )}
          Comments
        </h3>
      </div>
      {isExpanded && (
        <div className="bg-base-100 p-4 rounded-lg shadow max-h-40 overflow-y-auto space-y-4">
          {renderComments()}
        </div>
      )}

      <div className="mt-4">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          {/* Display the attached image preview */}
          {data.image && (
            <div className="mt-2">
              <p className="text-sm">Attached Image:</p>
              <img
                src={URL.createObjectURL(data.image)}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md mt-2"
              />
              <p className="text-xs text-gray-500 mt-1 mb-2">
                {data.image.name}
              </p>
            </div>
          )}

          <div className="flex">
            <div
              className="cursor-pointer my-3 flex me-3 btn btn-xs hover:text-white hover:border hover:border-base-300 transform hover:scale-105"
              onClick={handleIconClick}
            >
              <FaPlus size={20} className="text-base-10 h-4 w-4" />
              {/* <span className="ml-2 text-sm">Add Image</span> */}
            </div>
            <input
              type="file"
              name="image"
              ref={fileInputRef} // Attach the ref to the file input
              className="file-input file-input-bordered file-input-sm w-full my-4 max-w-xs hidden" // Hide the file input
              onChange={handleFileChange}
              accept="image/*"
            />

            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Add a comment..."
              rows="2"
              value={data.text}
              onChange={(e) => setData({ ...data, text: e.target.value })}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary btn-sm mt-3">
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Comment Modal */}
      {isDeleteCommentModalOpen && (
        <DeleteCommentModal
          onClose={() => setIsDeleteCommentModalOpen(false)}
          commentId={deleteCommentId}
          setComments={setComments}
        />
      )}
    </div>
  );
};

export default DrawerCommentDetails;
