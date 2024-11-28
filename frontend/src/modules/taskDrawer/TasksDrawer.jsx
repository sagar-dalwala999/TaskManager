import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

import DrawerSubTaskDetails from "./DrawerSubTaskDetails";
import EditSubTask from "../subtask/EditSubTask";
import DeleteSubTask from "../subtask/DeleteSubTask";

import DrawerCommentDetails from "./DrawerCommentDetails";

import DrawerTaskDetails from "./DrawerTaskDetails";
import EditTask from "../tasks/EditTask";
import DeleteTask from "../tasks/DeleteTask";
import AddSubTask from "../subtask/AddSubTask";
import toast from "react-hot-toast";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const TasksDrawer = ({ closeDrawer, task, user }) => {
  //* user role
  // eslint-disable-next-line react/prop-types
  const userRole = user?.data?.role || "user";

  const [currentView, setCurrentView] = useState({ type: "task", data: task });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false);
  const [isEditSubTaskModalOpen, setIsEditSubTaskModalOpen] = useState(false);
  const [isDeleteSubTaskModalOpen, setIsDeleteSubTaskModalOpen] =
    useState(false);

  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // New state to manage drawer visibility

  //* Manage drawer visibility for smooth transitions
  useEffect(() => {
    // Delay opening animation slightly after component mounts
    const timer = setTimeout(() => setIsDrawerOpen(true), 50);
    return () => clearTimeout(timer); // Clean up timeout on unmount
  }, []);

  //* open subtask
  const openSubTask = (subtask) => {
    setCurrentView({ type: "subtask", data: subtask });
    setSelectedSubTask(subtask);
  };

  //* go back to task
  const goBackToTask = () => {
    setCurrentView({ type: "task", data: task });
  };

  //* close drawer
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false); // Start closing animation
    setTimeout(() => {
      closeDrawer();
    }, 100); // Notify parent after animation completes
  };
  const [loading, setLoading] = useState(false);

  const [taskData, setTaskData] = useState(null);
  const [subTaskData, setSubTaskData] = useState(null);
  const [commentData, setCommentData] = useState(null);

  const fetchTasksWithUsersAndSubTasksAndComments = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        // eslint-disable-next-line react/prop-types
        `${import.meta.env.VITE_API_BASE_URL}/tasks/populate/${task?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        setTaskData(response.data.data.task);
        setSubTaskData(response.data.data.subtasks);
        setCommentData(response.data.data.task.commentsId);
      }
    } catch (error) {
      console.log("Error in fetching tasks: ", error.message);
      toast.error("Internal Server Error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksWithUsersAndSubTasksAndComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [userOptions, setUserOptions] = useState([]); // State for user options

  useEffect(() => {
    const options = taskData?.userId.map((user) => ({
      // eslint-disable-next-line react/prop-types
      value: user._id,
      // eslint-disable-next-line react/prop-types
      label: user.email,
    }));

    setUserOptions(options);
  }, [taskData]);

  return (
    <div className="drawer drawer-end z-10">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle"
        checked={isDrawerOpen} // Bind drawer state to checkbox
        onChange={(e) => setIsDrawerOpen(e.target.checked)} // Toggle drawer state
      />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          className="drawer-overlay"
          onClick={handleCloseDrawer} // Close drawer on outside click
        ></label>

        <div
          className={`menu bg-base-200 text-base-content min-h-full w-full lg:w-2/5 p-4 grid grid-rows-[auto,1fr,auto] gap-4 shadow transition-transform duration-100 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          } `}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-center sm:text-left">
              {currentView.type === "task" ? "Task Details" : "Subtask Details"}
            </h3>
            <button
              className="btn btn-ghost btn-sm me-2"
              onClick={handleCloseDrawer}
            >
              <MdClose size={20} />
            </button>
          </div>

          {currentView.type === "task" ? (
            <>
              <div className="space-y-4 mb-4">
                <DrawerTaskDetails
                  task={taskData}
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
                  subtasks={subTaskData}
                  loading={loading}
                  // subtasks={subtasks}
                  // setSubtasks={setSubtasks}
                  // updateSubtasks={updateSubtasks}
                />
              </div>

              <DrawerCommentDetails
                user={user}
                task={task}
                comments={commentData}
                loadingComments={loading}
              />
            </>
          ) : (
            <>
              <div className="space-y-4 mb-4">
                <button className="btn btn-ghost btn-sm" onClick={goBackToTask}>
                  ← Back to Task
                </button>
                <DrawerTaskDetails
                  task={currentView.data}
                  setIsEditModalOpen={setIsEditSubTaskModalOpen}
                  setIsDeleteModalOpen={setIsDeleteSubTaskModalOpen}
                />
              </div>
            </>
          )}
        </div>
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
          userOptions={userOptions}
          // updateSubtasks={updateSubtasks}  // Pass callback to update subtasks
        />
      )}

      {userRole === "admin" && isEditSubTaskModalOpen && (
        <EditSubTask
          setIsModalOpen={setIsSubTaskModalOpen}
          subtask={selectedSubTask}
          onClose={() => setIsEditSubTaskModalOpen(false)}
          task={task}
          userOptions={userOptions}
          // updateSubtasks={updateSubtasks} // Pass the updateSubtasks function here
        />
      )}

      {userRole === "admin" && isDeleteSubTaskModalOpen && (
        <DeleteSubTask
          subtask={selectedSubTask}
          setIsModalOpen={setIsSubTaskModalOpen}
          onClose={() => setIsDeleteSubTaskModalOpen(false)}
          // updateSubtasks={updateSubtasks} // Pass the updateSubtasks function here
        />
      )}
    </div>
  );
};

export default TasksDrawer;
