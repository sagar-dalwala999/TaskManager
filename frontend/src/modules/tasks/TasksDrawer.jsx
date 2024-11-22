import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addTask, fetchSubTasks } from "../..//redux/slices/tasksSlice";

import DrawerTaskDetails from "./DrawerTaskDetails";
import DrawerSubTaskDetails from "./DrawerSubTaskDetails";
import DrawerCommentDetails from "./DrawerCommentDetails";

import TaskModal from "./TaskModal";
import toast from "react-hot-toast";
import EditTask from "./EditTask";
import EditSubTask from "./EditSubTask";
import DeleteTask from "./DeleteTask";
import DeleteSubTask from "./DeleteSubTask";
import EditCommentModal from "../comment/EditCommentModal";
import DeleteCommentModal from "../comment/DeleteCommentModal";

// eslint-disable-next-line react/prop-types
const TasksDrawer = ({ task, closeDrawer, userRole, userId }) => {
  const dispatch = useDispatch();

  // State to track the currently viewed item (task or subtask)
  const [currentView, setCurrentView] = useState({ type: "task", data: task });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for Subtask Modal
  const [isSubTaskModalOpen, setIsSubTaskModalOpen] = useState(false);
  const [isEditSubTaskModalOpen, setIsEditSubTaskModalOpen] = useState(false);
  const [isDeleteSubTaskModalOpen, setIsDeleteSubTaskModalOpen] =
    useState(false);

  // State for Comment Modal
  const [isEditCommentModalOpen, setIsEditCommentModalOpen] = useState(false);
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] =
    useState(false);

  const [selectedSubTask, setSelectedSubTask] = useState(null);

  // Redux state for subtasks
  const { subtasks, loading, error } = useSelector((state) => state.tasks);

  // eslint-disable-next-line react/prop-types
  const taskId = String(task?._id);

  // Fetch subtasks when the task view changes
  useEffect(() => {
    if (currentView.type === "task") {
      dispatch(fetchSubTasks(taskId));
    }
  }, [dispatch, currentView, taskId]);

  // Function to handle opening a subtask
  const openSubTask = (subtask) => {
    setCurrentView({ type: "subtask", data: subtask });
    setSelectedSubTask(subtask); // Set the selected subtask for editing
  };

  // Function to go back to the main task
  const goBackToTask = () => {
    setCurrentView({ type: "task", data: task });
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    type: "Normal",
    users: [],
  });

  const [commentId, setCommentId] = useState("");

  const handleAddSubTaskSubmit = () => {
    if (formData.title && formData.description && formData.users.length > 0) {
      // Only send user IDs (not the full object with value/label)
      const userIds = formData.users.map((user) => user.value);

      dispatch(
        addTask({
          ...formData,
          userId: userIds, // send only the user IDs
          // eslint-disable-next-line react/prop-types
          subTasksId: task?._id,
        })
      )
        .unwrap()
        .then(() => {
          toast("Task added successfully");
          setIsSubTaskModalOpen(false);
        })
        .catch((err) => alert("Error adding task: " + err.message));
    } else {
      toast("Please fill in all required fields");
    }
  };

  return (
    <div className="drawer drawer-end z-10">
      <input
        id="my-drawer-4"
        type="checkbox"
        className="drawer-toggle"
        checked={!!task}
        readOnly
      />
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          className="drawer-overlay"
          onClick={closeDrawer}
        ></label>

        <div className="menu bg-base-200 text-base-content min-h-full w-full lg:w-1/3 p-4 grid grid-rows-[auto,1fr,auto] gap-4">
          <div className="flex items-center justify-between mb-4 me-4">
            <h3 className="text-xl font-semibold text-center sm:text-left">
              {currentView.type === "task" ? "Task Details" : "Subtask Details"}
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={closeDrawer}>
              Close
            </button>
          </div>

          {currentView.type === "task" ? (
            <>
              <div className="space-y-4 mb-4">
                <DrawerTaskDetails
                  task={task}
                  setIsModalOpen={closeDrawer}
                  setIsEditModalOpen={setIsEditModalOpen}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  userRole={userRole}
                />
                <DrawerSubTaskDetails
                  onSubTaskClick={openSubTask}
                  setIsSubTaskModalOpen={setIsSubTaskModalOpen}
                  setIsEditModalOpen={setIsEditSubTaskModalOpen}
                  setIsDeleteModalOpen={setIsDeleteSubTaskModalOpen}
                  subtasks={subtasks} // Pass the fetched subtasks to the component
                  loading={loading} // Pass the loading state
                  error={error} // Pass the error state if any
                  userRole={userRole}
                  setSelectedSubTask={setSelectedSubTask}
                />
              </div>

              <DrawerCommentDetails
                setCommentId={setCommentId}
                taskId={taskId}
                userId={userId}
                setIsEditCommentModalOpen={setIsEditCommentModalOpen}
                setIsDeleteCommentModalOpen={setIsDeleteCommentModalOpen}
                userRole={userRole}
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

      {/* Task Modals */}
      {/* Edit Task: */}
      {userRole === "admin" && isEditModalOpen && (
        <EditTask
          setIsModalOpen={setIsEditModalOpen}
          task={task}
          mode="edit"
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Delete Task: */}
      {userRole === "admin" && isDeleteModalOpen && (
        <DeleteTask
          task={task}
          setIsModalOpen={setIsDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}

      {/* Subtask Modals */}

      {/* Add Subtask */}
      {userRole === "admin" && isSubTaskModalOpen && (
        <TaskModal
          setIsModalOpen={setIsSubTaskModalOpen}
          task={task}
          mode="subtask"
          handleSubmit={handleAddSubTaskSubmit}
          onClose={() => setIsSubTaskModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* Edit Subtask */}
      {userRole === "admin" && isEditSubTaskModalOpen && (
        <EditSubTask
          setIsModalOpen={setIsSubTaskModalOpen}
          task={selectedSubTask}
          mode="edit-subtask"
          onClose={() => setIsEditSubTaskModalOpen(false)}
        />
      )}

      {/* Delete Subtask: */}
      {userRole === "admin" && isDeleteSubTaskModalOpen && (
        <DeleteSubTask
          subtask={selectedSubTask}
          setIsModalOpen={setIsSubTaskModalOpen}
          mode="subtask"
          onClose={() => setIsDeleteSubTaskModalOpen(false)}
        />
      )}

      {/* Comment Modals */}

      {/* Edit Comment */}
      {isEditCommentModalOpen && (
        <EditCommentModal
          setIsModalOpen={setIsEditCommentModalOpen}
          commentId={commentId}
          mode="edit"
          onClose={() => setIsEditCommentModalOpen(false)}
        />
      )}

      {/* Delete Comment */}
      {isDeleteCommentModalOpen && (
        <DeleteCommentModal
          setIsModalOpen={setIsDeleteCommentModalOpen}
          commentId={commentId}
          onClose={() => setIsDeleteCommentModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TasksDrawer;
