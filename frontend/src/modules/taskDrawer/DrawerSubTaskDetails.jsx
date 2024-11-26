/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const DrawerSubTaskDetails = ({
  onSubTaskClick,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setIsSubTaskModalOpen,
  setSelectedSubTask,
  userRole,
  task,
  // subtasks,
  // updateSubtasks,
  // setSubtasks
}) => {
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const taskId = task?._id; // Get taskId from the task object

  // Fetch subtasks for the given taskId
  const fetchSubtasks = async () => {
    if (!taskId) return;

    try {
      const response = await axios.get(`http://localhost:3000/api/v1/tasks/subtasks/${taskId}`, {
        headers: {
          Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        setSubtasks(response.data.data); // Store the subtasks in the state
        // updateSubtasks(response.data.data);
        
      }
    } catch (error) {
      console.error("Error fetching subtasks:", error.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchSubtasks(); // Fetch subtasks when the component mounts or taskId changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const renderSubtasks = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-2">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      );
    }

    if (subtasks.length === 0) {
      return <p className="text-sm text-gray-500">No subtasks available</p>;
    }

    return subtasks.map((subtask, index) => (
      <li
        key={subtask.id || index}
        className="bg-base-200 p-2 rounded-lg cursor-pointer"
        onClick={() => onSubTaskClick(subtask)}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              subtask.status === "Completed" ? "line-through text-gray-400" : ""
            }`}
          >
            {subtask.title}
          </span>

          {userRole === "admin" && (
            <div
              className="dropdown dropdown-end"
              onClick={(e) => e.stopPropagation()} // Prevent triggering `onSubTaskClick`
            >
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
          )}
        </div>
      </li>
    ));
  };

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow me-4">
      {/* Header Section */}
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

      {/* Subtasks List */}
      <div className="overflow-y-auto pr-3 max-h-60">
        <ul className="space-y-2">{renderSubtasks()}</ul>
      </div>
    </div>
  );
};

export default DrawerSubTaskDetails;
