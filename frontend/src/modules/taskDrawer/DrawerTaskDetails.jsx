/* eslint-disable react/prop-types */
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";

const DrawerTaskDetails = ({
  task,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  userRole,
  loading
}) => {

  return (
    /* Task Details Container - bg-base-100 */
    <div
      className={`p-4 rounded-lg shadow relative me-4 bg-base-100 
    `}
    >
      {/* Task Actions Dropdown */}
      {userRole === "admin" && (
        <div className="absolute top-4 right-4">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-xs">
              ⋮
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-box w-32 shadow z-10"
            >
              <li>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  disabled={userRole !== "admin"}
                  className="flex items-center hover:text-primary transition duration-300 ease-in-out"
                >
                  <LiaEdit className="w-4 h-4" /> Edit
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={userRole !== "admin"}
                  className="text-error"
                >
                  <MdDeleteOutline className="w-4 h-4" /> Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Task Details */}
      <h2
        className={`text-lg font-bold ${
          task?.status === "Completed" ? "line-through text-gray-400" : ""
        } `}
      >
        {task?.title || "Task Title"}
      </h2>
      <p
        className={`mt-2 text-md ${
          task?.status === "Completed" ? "line-through text-gray-400" : ""
        } `}
      >
        {task?.description || "No Description Available"}
      </p>
      <p
        className={`text-sm text-gray-500 dark:text-gray-400/80 mt-1 ${
          task?.status === "Completed" ? "line-through text-gray-400" : ""
        } `}
      >
        <span className="font-medium">{task?.status || "Unknown"}</span>
      </p>
      <p
        className={`text-sm text-gray-500 dark:text-gray-400/80 mt-1 
      ${task?.status === "Completed" ? "line-through text-gray-400" : ""}`}
      >
        <span className="font-medium">{task?.type || "Unspecified"}</span>
      </p>

      {/* Assigned Users */}
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          <span className="font-medium">Assigned to: </span>
        </p>
        {loading ? (
          <div className="flex justify-center items-center py-2">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : (
          <div
            className="overflow-y-auto max-h-32 mt-2"
            style={{ maxHeight: "150px" }}
          >
            {task?.userId.length === 0 ? (
              <p>No assignees available.</p>
            ) : (
              task?.userId.map((user) => (
                <div
                  key={user?._id}
                  className="flex items-center mb-2 cursor-pointer"
                >
                  <img
                    src={`http://localhost:3000${user?.profilePic}`}
                    alt={user?.username}
                    className="w-8 h-8 object-cover rounded-full mr-2"
                  />
                  <div>
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        <span className="font-medium">
          {new Date(task?.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }) || "Unspecified"}
        </span>
      </p>
    </div>
  );
};

export default DrawerTaskDetails;
