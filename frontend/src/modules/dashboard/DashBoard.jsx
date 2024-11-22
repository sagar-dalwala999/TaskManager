import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleTask } from "../../redux/slices/tasksSlice";
import Navigation from "../../components/navbar/Navigation";
import Tasks from "../tasks/Tasks";
import TasksDrawer from "../tasks/TasksDrawer";
import { fetchUser } from "../../redux/slices/userSlice";

// eslint-disable-next-line react/prop-types
const DashBoard = ({ setTheme, theme }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  const dispatch = useDispatch();
  const { user, loading, token } = useSelector((state) => state.user);
  // eslint-disable-next-line no-unused-vars
  const { taskId } = useSelector((state) => state.tasks);

  // Fetch user details when Dashboard loads and if token exists
  useEffect(() => {
    if (token || localStorage.getItem("token")) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  // Fetch task details when a task is selected
  useEffect(() => {
    if (selectedTask?.id) {
      dispatch(fetchSingleTask(selectedTask?.id));
    }
  }, [selectedTask, dispatch]);

  const openDrawer = (task) => {
    setSelectedTask(task);
  };

  const closeDrawer = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const userRole = user?.data?.role || "user"; // Default to 'user' if undefined

  return (
    <div className="h-screen flex flex-col">
      <div className="fixed w-full z-10">
        <Navigation setTheme={setTheme} theme={theme} user={user?.data} />
      </div>
      <div className="flex-grow mt-16 p-4">
        <Tasks onTaskClick={openDrawer} userRole={userRole} />
      </div>
      <div>
        <TasksDrawer
          task={selectedTask}
          closeDrawer={closeDrawer}
          userRole={userRole}
          userId={user?.data?._id}
        />
      </div>
    </div>
  );
};

export default DashBoard;
