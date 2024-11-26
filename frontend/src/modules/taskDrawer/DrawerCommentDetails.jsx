import { useState, useEffect } from "react";
import axios from "axios";
import EditCommentModal from "../comment/EditCommentModal";
import DeleteCommentModal from "../comment/DeleteCommentModal";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// eslint-disable-next-line react/prop-types
const DrawerCommentDetails = ({ user, task }) => {
  const [isEditCommentModalOpen, setIsEditCommentModalOpen] = useState(false);
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
    useState(false);

  const [data, setData] = useState({
    text: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const [users, setUsers] = useState({}); // Track users' details by userId

  const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited

  // eslint-disable-next-line react/prop-types
  const taskId = task?._id;

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

  const [socket, setSocket] = useState(null);

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

  // Handle form submission to add a comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.text.trim()) return; // Don't allow empty comments

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

  // Handle opening the edit modal
  const openEditCommentModal = (commentId) => {
    setEditingCommentId(commentId); // Set the comment ID for editing
    setIsEditCommentModalOpen(true); // Open the edit modal
  };

  // Handle opening the delete modal
  const openDeleteCommentModal = (commentId) => {
    setEditingCommentId(commentId); // Set the comment ID for deletion
    setIsDeleteCommentModalOpen(true); // Open the delete modal
  };

  const renderComments = () => {
    if (!comments.length) {
      return <p className="text-sm text-gray-500">No comments yet</p>;
    }

    return comments.map((comment) => {
      const userDetail = users[comment.userId]; // Get the user details from the `users` state

      return (
        <div
          key={comment._id}
          className="flex items-start space-x-2 bg-base-200 p-2 rounded-lg"
        >
          <img
            src={`http://localhost:3000${userDetail?.profilePic}`}
            alt="User Avatar"
            className="w-8 h-8 rounded-full cursor-pointer object-cover"
            onError={(e) => {
              e.target.src = "./avatar.svg";
            }}
          />
          <div className="flex items-center space-x-2">
            <div>
              <p className="text-sm font-medium cursor-pointer">
                {userDetail?.username}{" "}
                <span className="text-gray-400 text-xs ml-2">
                  {new Date(comment.createdAt).toLocaleDateString("en-CA")}
                </span>
              </p>
              <p className="text-sm">{comment.text}</p>
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
          {user?.data?._id === comment.userId && (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-xs">
                ⋮
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box w-32 shadow z-10"
              >
                <li>
                  <button onClick={() => openEditCommentModal(comment._id)}>
                    Edit
                  </button>
                </li>
                <li>
                  <button onClick={() => openDeleteCommentModal(comment._id)}>
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
      <h3 className="text-md font-semibold mb-2">Comments</h3>
      <div className="bg-base-100 p-4 rounded-lg shadow max-h-40 overflow-y-auto space-y-4">
        {renderComments()}
      </div>

      <div className="mt-4">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <textarea
            name="text"
            className="textarea textarea-bordered w-full noresize"
            placeholder="Add a comment..."
            rows="2"
            value={data.text}
            onChange={(e) => setData({ ...data, text: e.target.value })}
          ></textarea>
          <input
            type="file"
            name="image"
            className="file-input file-input-bordered file-input-sm w-full my-4"
            onChange={(e) => setData({ ...data, image: e.target.files[0] })}
          />
          <button type="submit" className="btn btn-primary btn-sm mt-2">
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>

      {/* Edit Comment Modal */}
      {isEditCommentModalOpen && (
        <EditCommentModal
          commentId={editingCommentId} // Pass the selected commentId
          setComments={setComments} // Pass the setComments function
          // comments={comments} // Pass the current comments array
          onClose={() => setIsEditCommentModalOpen(false)} // Close the modal after editing
        />
      )}

      {/* Delete Comment Modal */}
      {isDeleteCommentModalOpen && (
        <DeleteCommentModal
          commentId={editingCommentId} // Pass the selected commentId
          onClose={() => setIsDeleteCommentModalOpen(false)} // Close the modal after deleting
          setComments={setComments} // Pass the setComments function
        />
      )}
    </div>
  );
};

export default DrawerCommentDetails;
