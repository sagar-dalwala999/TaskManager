import {  useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import AuthModal from "../AuthModal";
import { useAuthContext } from "../../../context/AuthContextProvider";

import { validateEmail, validatePassword } from "../../../utils/authValidation";
import { useAppContext } from "../../../context/AppProvider";
import { fetchData } from "../../../utils/axiosInstance";

const Login = () => {
  const { setAuthUser } = useAuthContext();
  const { setUser } = useAppContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if all fields are filled
    if (!data.email || !data.password) {
      toast.error("Please provide all required fields.");
      setLoading(false);
      return;
    }

    // Validate email format
    if (validateEmail(data.email) === false) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Validate password length
    if (validatePassword(data.password) === false) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchData("/auth/login", "POST", data);

      if (response) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        setAuthUser(response.data);
        setUser(response.data.user);
        toast.success("Logged in successfully");
        setLoading(false);
        navigate("/");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.log("Error in logging in user: ", error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <AuthModal
      mode="login"
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
      data={data}
    />
  );
};

export default Login;
