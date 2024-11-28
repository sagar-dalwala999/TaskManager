/* eslint-disable react/prop-types */
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { customStyles } from "../../utils/customeStyles";
import { useEffect, useState } from "react";
import axios from "axios";

const animatedComponents = makeAnimated();

const TaskModal = ({
  onClose,
  mode = "add",
  handleSubmit,
  formData,
  setFormData,
  userOptionsForSubtask,
}) => {
  const [users, setUsers] = useState([]); // Initialize users state

  // Fetch users from API
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/get-all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
            },
          }
        );

        if (response?.status === 200) {
          setUsers(response.data.data); // Set fetched users
        }
      } catch (error) {
        console.log("Error in fetching users: ", error.message);
      }
    };
    fetchAllUsers();
  }, []);

  // Convert users to react-select options
  const userOptions = users.map((user) => ({
    value: user._id,
    label: user.email,
  }));

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle user selection change
  const handleUsersChange = (selectedOptions) => {
    setFormData({ ...formData, users: selectedOptions || [] });
  };

  // Correctly map formData.users to react-select value
  const optionsValue =
    formData.users?.map((user) =>
      typeof user === "object"
        ? user
        : userOptions.find((option) => option.value === user)
    ) || [];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md sm:min-w-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-base-content">
          {mode === "edit"
            ? "Edit Task"
            : mode === "subtask"
            ? "Add Sub Task"
            : mode === "edit-subtask"
            ? "Edit Sub Task"
            : mode === "add"
            ? "Add Task"
            : ""}
        </h3>
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block font-semibold text-base-content mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData?.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="input input-bordered w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-base-conten mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData?.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold text-base-content mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData?.status}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block font-semibold text-base-content mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData?.type}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Important">Important</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          {/* Users */}
          <div>
            <label className="block font-semibold text-base-content mb-1">
              Assign Users
            </label>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              value={optionsValue}
              options={
                mode === "add"
                  ? userOptions
                  : mode === "edit"
                  ? userOptions
                  : userOptionsForSubtask
              }
              onChange={handleUsersChange}
              styles={customStyles}
              className="w-full react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {mode === "edit" ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
