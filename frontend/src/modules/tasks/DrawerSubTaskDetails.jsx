/* eslint-disable react/prop-types */

const DrawerSubTaskDetails = ({
  onSubTaskClick,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setIsSubTaskModalOpen,
  subtasks,
  setSelectedSubTask,
  userRole,
}) => {
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow me-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-semibold">Subtasks</h3>
        {userRole === "admin" && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsSubTaskModalOpen(true)}
          >
            Add Subtask
          </button>
        )}
      </div>
      <div className="flex justify-between items-center mb-2"></div>
      <div className="overflow-y-auto pr-3 max-h-60">
        {" "}
        {/* Scrollable area */}
        <ul className="space-y-2">
          {subtasks && subtasks.length > 0 ? (
            subtasks.map((subtask, index) => (
              <li
                key={index}
                className="space-x-2 bg-base-200 p-2 rounded-lg cursor-pointer"
                onClick={() => onSubTaskClick(subtask)} // Handle subtask click
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={
                        subtask?.status === "Completed" ? "line-through" : ""
                      }
                    >
                      {subtask?.title}
                    </span>
                  </div>
                  {/* Dropdown for Subtask Actions */}
                  <div
                    className="dropdown dropdown-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {userRole === "admin" && (
                      <button tabIndex={0} className="btn btn-ghost btn-xs">
                        ⋮
                      </button>
                    )}
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box w-32 shadow z-10"
                    >
                      <li>
                        <button
                          onClick={() => {
                            setIsEditModalOpen(true);
                            setSelectedSubTask(subtask);
                          }}
                        >
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectedSubTask(subtask);
                          }}
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500">No subtasks available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DrawerSubTaskDetails;
