import AuthModal from "../AuthModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../../utils/authValidation";

import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if all fields are filled
    if (!data.email || !data.password || !data.username || !data.profilePic) {
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

    if (validateUsername(data.username) === false) {
      toast.error("Username must be at least 3 characters long.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profilePic", data.profilePic);

    try {
      const response = await axios.post(
        `
        ${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
        formData
      );

      if (response) {
        toast.success("User registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic" && files && files[0]) {
      setData((prev) => ({ ...prev, profilePic: files[0] })); // Store file
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <AuthModal
      mode="signup"
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      data={data}
      loading={loading}
    />
  );
};

export default SignUp;
