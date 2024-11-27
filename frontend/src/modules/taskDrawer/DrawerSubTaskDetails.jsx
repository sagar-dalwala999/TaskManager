/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { LiaEdit } from "react-icons/lia";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const DrawerSubTaskDetails = ({
  onSubTaskClick,
  setIsEditModalOpen,
  setIsDeleteModalOpen,
  setIsSubTaskModalOpen,
  setSelectedSubTask,
  userRole,
  loading,
  subtasks,
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // State for dropdown toggle

  const renderSubtasks = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-2">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      );
    }

    if (subtasks?.length === 0) {
      return (
        <p className="text-sm text-gray-500 py-4 ps-4">No subtasks available</p>
      );
    }

    return subtasks?.map((subtask, index) => (
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
              className="dropdown dropdown-left"
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
                    className="flex items-center hover:text-primary"
                  >
                    <LiaEdit className="w-4 h-4" /> Edit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                      setSelectedSubTask(subtask);
                    }}
                    className="flex items-center text-error"
                  >
                    <MdDeleteOutline className="w-4 h-4" /> Delete
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
      <div
        className="flex justify-between items-center mb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3
          className="text-md flex items-center cursor-pointer font-semibold tooltip tooltip-left"
          data-tip="Subtasks"
        >
          {isExpanded ? (
            <IoMdArrowDropup className="w-6 h-6" />
          ) : (
            <IoMdArrowDropdown className="w-6 h-6" />
          )}
          Subtasks
        </h3>
        {userRole === "admin" && (
          <button
            className="btn btn-primary btn-sm flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              setIsSubTaskModalOpen(true);
            }}
          >
            <IoMdAdd className="w-5 h-5" /> Add
          </button>
        )}
      </div>

      {/* Collapsible Subtasks List */}
      {isExpanded && (
        <div className={`bg-base-200 rounded-lg overflow-y-auto pr-3 max-h-60`}>
          <ul className="space-y-2">{renderSubtasks()}</ul>
        </div>
      )}
    </div>
  );
};

export default DrawerSubTaskDetails;
