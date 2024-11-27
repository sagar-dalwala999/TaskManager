import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";

import DrawerSubTaskDetails from "./DrawerSubTaskDetails";
import EditSubTask from "../subtask/EditSubTask";
import DeleteSubTask from "../subtask/DeleteSubTask";

import DrawerCommentDetails from "./DrawerCommentDetails";
import DrawerTaskDetails from "./DrawerTaskDetails";
import EditTask from "../tasks/EditTask";
import DeleteTask from "../tasks/DeleteTask";
import AddSubTask from "../subtask/AddSubTask";

// eslint-disable-next-line react/prop-types
const TasksDrawer = ({ closeDrawer, task, user }) => {
  //* User role
  const userRole = user?.data?.role || "user";

  const [currentView, setCurrentView] = useState({ type: "task", data: task });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false);
  const [isEditSubTaskModalOpen, setIsEditSubTaskModalOpen] = useState(false);
  const [isDeleteSubTaskModalOpen, setIsDeleteSubTaskModalOpen] =
    useState(false);

  const [selectedSubTask, setSelectedSubTask] = useState(null);

  // Manage drawer visibility for smooth transitions
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    // Delay opening animation slightly after component mounts
    const timer = setTimeout(() => setIsDrawerOpen(true), 50);
    return () => clearTimeout(timer); // Clean up timeout on unmount
  }, []);

  const openSubTask = (subtask) => {
    setCurrentView({ type: "subtask", data: subtask });
    setSelectedSubTask(subtask);
  };

  const goBackToTask = () => {
    setCurrentView({ type: "task", data: task });
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false); // Start closing animation
    setTimeout(() => {
      closeDrawer(); // Notify parent after animation completes
    }, 300); // Match with CSS transition duration
  };

  return (
    <div
      className={`fixed top-0 right-0 z-50 h-full bg-base-200 shadow-lg transition-transform duration-300 ease-in-out ${
        isDrawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ width: "100%", maxWidth: "33%" }}
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 bg-base-100">
        <h3 className="text-xl font-semibold">
          {currentView.type === "task" ? "Task Details" : "Subtask Details"}
        </h3>
        <button className="btn btn-ghost btn-sm" onClick={handleCloseDrawer}>
          <MdClose size={20} />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="p-4 overflow-y-auto">
        {currentView.type === "task" ? (
          <>
            <DrawerTaskDetails
              task={task}
              setIsEditModalOpen={setIsEditModalOpen}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              userRole={userRole}
            />
            <DrawerSubTaskDetails
              onSubTaskClick={openSubTask}
              setIsSubTaskModalOpen={setIsSubTaskModalOpen}
              setIsEditModalOpen={setIsEditSubTaskModalOpen}
              setIsDeleteModalOpen={setIsDeleteSubTaskModalOpen}
              setSelectedSubTask={setSelectedSubTask}
              userRole={userRole}
              task={task}
            />
            <DrawerCommentDetails user={user} task={task} />
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm mb-4" onClick={goBackToTask}>
              ← Back to Task
            </button>
            <DrawerTaskDetails
              task={currentView.data}
              setIsEditModalOpen={setIsEditSubTaskModalOpen}
              setIsDeleteModalOpen={setIsDeleteSubTaskModalOpen}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {userRole === "admin" && isEditModalOpen && (
        <EditTask
          setIsModalOpen={setIsEditModalOpen}
          task={task}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {userRole === "admin" && isDeleteModalOpen && (
        <DeleteTask
          task={task}
          setIsModalOpen={setIsDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      {userRole === "admin" && isSubTaskModalOpen && (
        <AddSubTask
          setIsModalOpen={setIsSubTaskModalOpen}
          task={task}
          onClose={() => setIsSubTaskModalOpen(false)}
        />
      )}
      {userRole === "admin" && isEditSubTaskModalOpen && (
        <EditSubTask
          setIsModalOpen={setIsEditSubTaskModalOpen}
          subtask={selectedSubTask}
          onClose={() => setIsEditSubTaskModalOpen(false)}
          task={task}
        />
      )}
      {userRole === "admin" && isDeleteSubTaskModalOpen && (
        <DeleteSubTask
          subtask={selectedSubTask}
          setIsModalOpen={setIsDeleteSubTaskModalOpen}
          onClose={() => setIsDeleteSubTaskModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TasksDrawer;