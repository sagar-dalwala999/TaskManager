/* eslint-disable react/prop-types */
import { useEffect } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useSelector, useDispatch } from "react-redux";

import { customStyles } from "../../utils/customeStyles";
import { fetchAllUsers } from "../../redux/slices/userSlice";

const animatedComponents = makeAnimated();

const TaskModal = ({
  onClose,
  mode = "add",
  handleSubmit,
  formData,
  setFormData,
}) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  useEffect(() => {
    if (!users?.data?.length) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, users]);


  const userOptions = Array.isArray(users?.data)
    ? users.data.map((user) => ({
        value: user._id,
        label: user.email,
      }))
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUsersChange = (selectedOptions) => {
    setFormData({ ...formData, users: selectedOptions || [] });
  };

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
        className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md"
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
            <label className="block font-semibold text-base-content">
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
            <label className="block font-semibold text-base-content">
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
            <label className="block font-semibold text-base-content">
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
            <label className="block font-semibold text-base-content">
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
            <label className="block font-semibold text-base-content">
              Assign Users
            </label>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              value={optionsValue}
              options={userOptions}
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
