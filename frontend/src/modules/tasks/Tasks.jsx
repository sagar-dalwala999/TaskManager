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
  // eslint-disable-next-line no-unused-vars
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

  return (
    <div className="flex flex-col w-full px-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-auto border-collapse border border-base-300 hidden sm:table">
            <thead>
              <tr className="bg-base-200">
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Type</th>
                <th>Assigned To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={task._id}
                  className="hover:bg-base-200 cursor-pointer hover:text-primary"
                  onClick={() => onTaskClick(task)}
                >
                  <th>{index + 1 + (currentPage - 1) * tasksPerPage}</th>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td
                    className={`${
                      task.status === "Completed" && "line-through"
                    } ${task.status === "Pending" && "text-error"} ${
                      task.status === "Ongoing" && "text-warning"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td
                    className={`${task.type === "Important" && "text-info"} ${
                      task.type === "Normal" &&
                      "text-gray-900 dark:text-gray-400"
                    }`}
                  >
                    {task.type}
                  </td>
                  <td>
                    {loading ? (
                      <span className="loading loading-spinner text-primary"></span>
                    ) : (
                      <div className="flex items-center flex-wrap gap-2">
                        {task.userId?.slice(0, 5).map((user) => (
                          <img
                            key={user?._id}
                            src={`${import.meta.env.VITE_BASE_PIC_URL}${
                              user?.profilePic
                            }`}
                            alt={user?.username}
                            className="w-8 h-8 object-cover rounded-full"
                            onError={(e) => (
                              e.target.src = `./avatar.svg`
                            )}
                          />
                        ))}
                        {task.userId?.length > 5 && (
                          <span className="text-sm text-gray-600">
                            +{task.userId.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* For Mobile */}

      {loading ? (
        <div className="flex justify-center items-center py-12 md:hidden lg:hidden">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="bg-base-200 rounded-lg shadow-lg p-4 mb-4 cursor-pointer md:hidden lg:hidden"
            onClick={() => onTaskClick(task)}
          >
            <p className="text-lg font-bold">{task.title}</p>
            <p className="text-gray-600">{task.description}</p>
            <p
              className={`${
                task.status === "Completed" &&
                "line-through badge badge-success badge-outline"
              } ${
                task.status === "Pending" && "badge badge-error badge-outline"
              } ${
                task.status === "Ongoing" && "badge badge-warning badge-outline"
              }`}
            >
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
                <span className="text-sm text-gray-600">
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
        ))
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
