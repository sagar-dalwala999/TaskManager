/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";

import AddTask from "./AddTask";
import TasksPagination from "./pagination/TasksPagination";

const Tasks = ({ onTaskClick, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for tasks
  const userRole = user?.data?.role || "user";
  const [tasksPerPage, setTasksPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState();
  const [tasks, setTasks] = useState([]);

  // Dynamically compute endpoint based on user role, page, and perPage
  const endpoint = useMemo(() => {
    return userRole === "admin"
      ? `${
          import.meta.env.VITE_API_BASE_URL
        }/tasks/all?perPage=${tasksPerPage}&pageNo=${currentPage}`
      : `${
          import.meta.env.VITE_API_BASE_URL
        }/tasks/user-tasks?perPage=${tasksPerPage}&pageNo=${currentPage}`;
  }, [userRole, tasksPerPage, currentPage]);

  //* Fetch all tasks
  useEffect(() => {
    const fetchAllTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          const fetchedTasks = response.data.data?.tasks || [];
          setTasks(fetchedTasks); // Set fetched tasks
          localStorage.setItem("tasks", JSON.stringify(fetchedTasks));
        } else {
          setTasks([]);
        }

        setTotalTasks(Math.ceil(response.data.data?.totalTasks / tasksPerPage));
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, [endpoint, tasksPerPage, currentPage]);

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  // Group tasks by status
  const groupedTasks = {
    Completed: tasks.filter((task) => task.status === "Completed"),
    Pending: tasks.filter((task) => task.status === "Pending"),
    Ongoing: tasks.filter((task) => task.status === "Ongoing"),
  };

  return (
    <div className="flex flex-col w-full px-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Board</h2>
        {userRole === "admin" && (
          <button
            type="button"
            className="btn btn-primary flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <IoMdAdd className="w-6 h-6" /> Add Task
          </button>
        )}
      </div>

      {/* For Mobile */}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-12">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Completed Tasks */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-green-500">Completed</h3>
            {groupedTasks.Completed.map((task) => (
              <div
                key={task._id}
                className={`bg-base-300 rounded-lg shadow-lg p-4 cursor-pointer ${
                  task.status === "Completed" ? "bg-green-200" : ""
                } `}
                onClick={() => onTaskClick(task)}
              >
                <p className="text-lg font-bold">{task.title}</p>
                <p className="text-gray-600">{task.description}</p>
                <p className="line-through badge badge-success badge-outline">
                  {task.status}
                </p>
                <p
                  className={`${
                    task.type === "Important" &&
                    "badge badge-info badge-outline mx-2"
                  } ${
                    task.type === "Normal" &&
                    "badge badge-outline mx-2 text-gray-900 dark:text-gray-400"
                  } mb-2`}
                >
                  {task.type}
                </p>
                <div className="flex items-center flex-wrap gap-2">
                  {task.userId?.slice(0, 5).map((user) => (
                    <img
                      key={user?._id}
                      src={`${import.meta.env.VITE_BASE_PIC_URL}${
                        user?.profilePic
                      }`}
                      alt={user?.username}
                      className="w-8 h-8 object-cover rounded-full mb-2"
                    />
                  ))}
                  {task.userId?.length > 5 && (
                    <span className="text-sm text-gray-700">
                      +{task.userId.length - 5}
                    </span>
                  )}
                </div>
                <p>
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>

          {/* Pending Tasks */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-yellow-300">Pending</h3>
            {groupedTasks.Pending.map((task) => (
              <div
                key={task._id}
                className="bg-yellow-200 rounded-lg shadow-lg p-4 cursor-pointer"
                onClick={() => onTaskClick(task)}
              >
                <p className="text-lg font-bold">{task.title}</p>
                <p className="text-gray-700">{task.description}</p>
                <p className="badge badge-error badge-outline">{task.status}</p>
                <p
                  className={`${
                    task.type === "Important" &&
                    "badge badge-info badge-outline mx-2"
                  } ${
                    task.type === "Normal" &&
                    "badge badge-outline mx-2 text-gray-900 dark:text-gray-400"
                  } mb-2`}
                >
                  {task.type}
                </p>
                <div className="flex items-center flex-wrap gap-2">
                  {task.userId?.slice(0, 5).map((user) => (
                    <img
                      key={user?._id}
                      src={`${import.meta.env.VITE_BASE_PIC_URL}${
                        user?.profilePic
                      }`}
                      alt={user?.username}
                      className="w-8 h-8 object-cover rounded-full mb-2"
                    />
                  ))}
                  {task?.userId?.length > 5 && (
                    <span className="text-sm text-gray-700">
                      +{task?.userId?.length - 5}
                    </span>
                  )}
                </div>
                <p>
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>

          {/* Ongoing Tasks */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-error">Ongoing</h3>
            {groupedTasks.Ongoing.map((task) => (
              <div
                key={task._id}
                className="bg-red-200 rounded-lg shadow-lg p-4 cursor-pointer"
                onClick={() => onTaskClick(task)}
              >
                <p className="text-lg font-bold">{task.title}</p>
                <p className="text-gray-700">{task.description}</p>
                <p className="badge badge-warning badge-outline">
                  {task.status}
                </p>
                <p
                  className={`${
                    task.type === "Important" &&
                    "badge badge-info badge-outline mx-2"
                  } ${
                    task.type === "Normal" &&
                    "badge badge-outline mx-2 text-gray-900 dark:text-gray-400"
                  } mb-2`}
                >
                  {task.type}
                </p>
                <div className="flex items-center flex-wrap gap-2">
                  {task?.userId?.slice(0, 5).map((user) => (
                    <img
                      key={user?._id}
                      src={`${import.meta.env.VITE_BASE_PIC_URL}${
                        user?.profilePic
                      }`}
                      alt={user?.username}
                      className="w-8 h-8 object-cover rounded-full mb-2"
                    />
                  ))}
                  {task?.userId?.length > 5 && (
                    <span className="text-sm text-gray-600">
                      +{task?.userId?.length - 5}
                    </span>
                  )}
                </div>
                <p>
                  {new Date(task.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <TasksPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalTasks}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Task</h3>
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-outline"
            >
              Close Modal
            </button>
            <AddTask
              setIsModalOpen={setIsModalOpen}
              onAddTask={handleAddTask}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
