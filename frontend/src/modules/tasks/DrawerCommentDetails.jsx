/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addComment, fetchComments } from "../../redux/slices/commentsSlice";
import { fetchUsersById } from "../../redux/slices/userSlice";

const DrawerCommentDetails = ({
  taskId,
  userId,
  setIsEditCommentModalOpen,
  setIsDeleteCommentModalOpen,
  setCommentId,
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    text: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const { users } = useSelector((state) => state.user);
  const { comments } = useSelector((state) => state.comments);

  useEffect(() => {
    dispatch(fetchComments(taskId))
      .unwrap()
      .then((response) => {
        if (response.status === "success") {
          toast.success("Comments fetched successfully!");
        }
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [dispatch, taskId]);

  useEffect(() => {
    if (comments?.length) {
      const uniqueUserIds = [
        ...new Set(comments.map((comment) => comment.userId)),
      ];
      dispatch(fetchUsersById(uniqueUserIds))
        .unwrap()
        .then((response) => {
          if (response.status === "success") {
            toast.success("Users fetched successfully!");
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
  }, [comments, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      setData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!data.text && !data.image) {
      toast.error("Please provide all required fields.");
    }

    const formData = new FormData();
    if (data.text) formData.append("text", data.text);
    if (data.image) formData.append("image", data.image);

    try {
      const response = await dispatch(
        addComment({
          data: {
            formData,
            userId,
            taskId,
          },
          taskId,
        })
      ).unwrap();

      if (response.status === "success") {
        toast.success("Comment added successfully!");
        setLoading(false);
        setData({ text: "", image: null });
        formData.delete("image");
        await dispatch(fetchComments(taskId)).unwrap();
      }
    } catch (error) {
      console.log("Error adding comment:", error.message);
      toast.error("Error adding comment!");
    } finally {
      setLoading(false);
    }
  };

  const getUser = (userId) => {
    return users?.find((user) => user._id === userId);
  };

  return (
    <div className="mt-4 me-4">
      <h3 className="text-md font-semibold mb-2">Comments</h3>
      <div className="bg-base-100 p-4 rounded-lg shadow max-h-40 overflow-y-auto space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => {
            const user = getUser(comment.userId);
            return (
              <div
                key={index}
                className="flex items-start justify-between bg-base-200 p-2 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  {user && user.profilePic && (
                    <img
                      src={`http://localhost:3000${user.profilePic}`}
                      alt={`${user.username}'s avatar`}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {user?.username}{" "}
                      <span className="text-gray-400 text-xs">
                        {new Date(comment?.createdAt).toLocaleDateString("en-CA")}
                      </span>
                    </p>
                    <p className="text-sm">{comment.text}</p>
                    {comment.image && (
                      <img
                        src={`http://localhost:3000${comment.image}`}
                        alt="Comment Image"
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
                {userId === comment.userId && (
                  <div className="dropdown dropdown-end">
                    <button
                      tabIndex={0}
                      className="btn btn-ghost btn-xs"
                      onClick={() => setCommentId(comment._id)}
                    >
                      ⋮
                    </button>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box w-32 shadow z-10"
                    >
                      <li>
                        <button
                          onClick={() => {
                            setIsEditCommentModalOpen(true);
                            setCommentId(comment._id);
                          }}
                        >
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setIsDeleteCommentModalOpen(true);
                            setCommentId(comment._id);
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
          })
        ) : (
          <p className="text-sm text-gray-500">No comments yet</p>
        )}
      </div>

      <div className="mt-4">
        <form encType="multipart/form-data" onSubmit={handleAddComment}>
          <textarea
            name="text"
            className="textarea textarea-bordered w-full noresize"
            placeholder="Add a comment..."
            rows="2"
            onChange={handleChange}
            value={data.text}
          ></textarea>
          <input
            type="file"
            name="image"
            className="file-input file-input-bordered file-input-sm w-full my-4"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm mt-2"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DrawerCommentDetails;
