import { useDispatch } from "react-redux";

import AuthModal from "../AuthModal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { signupUser } from "../../../redux/slices/userSlice";
// import {
//   validateEmail,
//   validatePassword,
//   validateUsername,
// } from "../../../utils/authValidation";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!data.username || !data.email || !data.password) {
      toast.error("Please provide all required fields.");
      setLoading(false);
      return;
    }
  
    if (!data.profilePic) {
      toast.error("Please upload a profile picture.");
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profilePic", data.profilePic);
  
    try {
      const response = await dispatch(signupUser(formData)).unwrap();
  
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
