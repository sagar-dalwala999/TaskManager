import { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./App.css";

import DashBoard from "./modules/dashboard/DashBoard";
import { useAuthContext } from "./context/AuthContextProvider";

import Login from "./modules/auth/login/Login";
import SignUp from "./modules/auth/signup/SignUp";

function App() {
  const [theme, setTheme] = useState(() => {
    // Check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    // Apply the theme to the document body
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const { authUser } = useAuthContext();

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={authUser ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/"
            element={
              authUser ? (
                <DashBoard setTheme={setTheme} theme={theme} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
