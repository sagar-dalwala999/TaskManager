/* eslint-disable react/prop-types */

const DrawerTaskDetails = ({
  task,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  userRole,
}) => {
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow relative me-4">
      {/* Dropdown for Task Actions - Top-Right Corner */}
      <div className="absolute top-4 right-4">
        <div className="dropdown dropdown-end">
          {userRole === "admin" && (
            <button tabIndex={0} className="btn btn-ghost btn-xs">
              ⋮
            </button>
          )}
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-200 rounded-box w-32 shadow z-10"
          >
            <li>
              <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
            </li>
            <li>
              <button onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Task Details */}
      <h2 className="text-lg font-bold">{task?.title || "Task Title"}</h2>
      <p className="text-sm text-gray-500">
        Assigned to:{" "}
        <span className="font-medium">
          {task?.userId.map((id) => id).join(", ") || "Assignee"}
        </span>
      </p>
      <p className="text-sm text-gray-500">
        Status: <span className="font-medium">{task?.status || "Status"}</span>
      </p>
      <p className="text-sm text-gray-500">
        Type: <span className="font-medium">{task?.type || "Type"}</span>
      </p>
      <p className="mt-2">{task?.description || "Description"}</p>
    </div>
  );
};

export default DrawerTaskDetails;
