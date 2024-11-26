/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

// Create the context

const AppContext = createContext();

const useAppContext = () => {
  return useContext(AppContext);
};

// Create the context provider component
const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState(null);
  const [subtask, setSubtask] = useState(null);

  return (
    <AppContext.Provider
      value={{ user, setUser, task, setTask, subtask, setSubtask }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { AppContext, AppProvider, useAppContext };
