import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:3000/api/v1", // Change this to your backend base URL
  withCredentials: true, // Allows sending cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or cookies
    const token = localStorage.getItem("token") || null;
    if (token) {
      config.headers["Authorization"] = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., token expiration)
      console.error("Unauthorized! Redirecting to login...");
      // Optionally clear the token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fetchData = async (url, method = "GET", data = null) => {
  try {
    const response = await axiosInstance({
      url,
      method,
      data,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

export default axiosInstance;
