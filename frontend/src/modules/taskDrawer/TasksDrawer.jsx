import { useState } from "react";
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

  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // New state to manage drawer visibility

  const openSubTask = (subtask) => {
    setCurrentView({ type: "subtask", data: subtask });
    setSelectedSubTask(subtask);
  };

  const goBackToTask = () => {
    setCurrentView({ type: "task", data: task });
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false); // Close the drawer when called
    closeDrawer(); // Optional: if you need to trigger a parent function
  };

  // const [subtasks, setSubtasks] = useState([]);

  // Callback function to update subtasks in the parent state
  // const updateSubtasks = (updatedSubtask) => {
  //   setSubtasks((prevSubtasks) =>
  //     prevSubtasks.map((subtask) =>
  //       subtask._id === updatedSubtask._id ? updatedSubtask : subtask
  //     )
  //   );
  // };
  
  

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
          className={`menu bg-base-200 text-base-content min-h-full w-full lg:w-1/3 p-4 grid grid-rows-[auto,1fr,auto] gap-4 transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          } `}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-center sm:text-left">
              {currentView.type === "task" ? "Task Details" : "Subtask Details"}
            </h3>
            <button
              className="btn btn-ghost btn-sm me-4"
              onClick={handleCloseDrawer}
            >
              Close
            </button>
          </div>

          {currentView.type === "task" ? (
            <>
              <div className="space-y-4 mb-4">
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
                  // subtasks={subtasks}
                  // setSubtasks={setSubtasks}
                  // updateSubtasks={updateSubtasks}
                />
              </div>

              <DrawerCommentDetails user={user} task={task} />
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
          // updateSubtasks={updateSubtasks}  // Pass callback to update subtasks
        />
      )}

      {userRole === "admin" && isEditSubTaskModalOpen && (
        <EditSubTask
          setIsModalOpen={setIsSubTaskModalOpen}
          subtask={selectedSubTask}
          onClose={() => setIsEditSubTaskModalOpen(false)}
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
