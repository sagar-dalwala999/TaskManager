import toast from "react-hot-toast";
import { fetchData } from "../utils/axiosInstance";

export const signUpUser = async (formData) => {
  try {
    const response = await fetchData("/auth/signup", "POST", formData);

    
    return response.data;
    // if (data.error) {
    //   toast.error(data.error);
    // }

    // if (data.success) {
    //   return data;
    // }
  } catch (error) {
    console.log("Error in signing up user: ", error.message);
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetchData("/auth/login", "POST", formData);

    if (response.data) {
      toast.error(response.data);
    }

    return response;

  } catch (error) {
    console.log("Error in logging in user: ", error.message);
  }
};


