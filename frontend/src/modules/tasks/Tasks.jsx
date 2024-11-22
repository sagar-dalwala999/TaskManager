/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TasksPagination from "./TasksPagination";
import { fetchTasks, setCurrentPage } from "../../redux/slices/tasksSlice";

import AddTask from "./AddTask";

const Tasks = ({ onTaskClick, userRole }) => {
  const dispatch = useDispatch();

  const { tasks, currentPage, totalPages, tasksPerPage, loading } = useSelector(
    (state) => state.tasks
  );

  const [isModalOpen, setIsModalOpen] = useState(); // Modal state

  useEffect(() => {
    if (userRole) {
      dispatch(fetchTasks({ tasksPerPage, currentPage, userRole }));
    }
  }, [dispatch, tasksPerPage, currentPage, userRole]);

  // Make a shallow copy of tasks to sort it without modifying the original Redux state
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sorting by status: Pending -> Ongoing -> Completed
    const statusOrder = { Pending: 0, Ongoing: 1, Completed: 2 };
    const statusComparison = statusOrder[a.status] - statusOrder[b.status];
    if (statusComparison !== 0) return statusComparison;

    // If status is the same, sort by type: Important -> Normal
    const typeOrder = { Important: 0, Normal: 1 };
    return typeOrder[a.type] - typeOrder[b.type];
  });

  return (
    <div className="flex flex-col w-full px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Add Task
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full table-auto border-collapse border border-base-300">
          <thead>
            <tr className="bg-base-200">
              <th className="text-left px-4">#</th>
              <th className="text-left px-4">Title</th>
              <th className="text-left px-4">Description</th>
              <th className="text-left px-4">Status</th>
              <th className="text-left px-4">Type</th>
            </tr>
          </thead>
          {loading && (
            <div className="flex justify-center items-center">Loading...</div>
          )}
          <tbody>
            {sortedTasks.map((task, index) => (
              <tr
                key={task._id}
                className="hover:bg-base-100 cursor-pointer"
                onClick={() => onTaskClick(task)}
              >
                <th className="px-4">{index + 1}</th>
                <td className="px-4">{task.title}</td>
                <td className="px-4">{task.description}</td>
                <td className="px-4">{task.status}</td>
                <td className="px-4">{task.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TasksPagination
        currentPage={currentPage}
        setCurrentPage={(page) => {
          dispatch(setCurrentPage(page));
        }}
        totalPages={totalPages}
      />

      {/* Add task modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Task</h3>
            <button
              onClick={() => {
                console.log("Closing modal");
                setIsModalOpen(false); // Close the modal
              }}
              className="btn btn-outline"
            >
              Close Modal
            </button>
            {/* AddTask Component */}
            <AddTask setIsModalOpen={setIsModalOpen} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
