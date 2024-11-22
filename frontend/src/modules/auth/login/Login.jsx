import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

import AuthModal from "../AuthModal";
import { loginUser, setUserRole } from "../../../redux/slices/userSlice";
import { useAuthContext } from "../../../context/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../../utils/authValidation";

const Login = () => {
  const { setAuthUser } = useAuthContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

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
      const response = await dispatch(loginUser(data)).unwrap();

      if (response) {
        console.log(response.data.token);
        localStorage.setItem("token", JSON.stringify(response.data.token));
        setAuthUser({
          userName: response.data.username,
          userId: response.data._id,
          profilePic: response.data.profilePic,
          userRole: response.data.role,
          token: response.data.token,
        });

        setUserRole(response.data.role);
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
