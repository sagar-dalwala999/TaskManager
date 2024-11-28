/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserProfile = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    username: user?.data?.username || "",
    email: user?.data?.email || "",
    profilePic: user?.data?.profilePic || "", // URL of the profile picture
  });
  const [profilePicFile, setProfilePicFile] = useState(null); // File object for preview

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file); // Set the file for preview

      const uploadData = new FormData();
      uploadData.append("profilePic", file);

      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/edit-profile-pic/${
            user?.data?._id
          }`,
          uploadData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
          }
        );
        if (response.status === 200 && response.data.success) {
          setFormData((prev) => ({
            ...prev,
            profilePic: response.data.profilePic, // Update the URL
          }));
          toast.success("Profile picture updated successfully!");
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error.message);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      username: formData.username,
      email: formData.email,
    };

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/edit-user/${
          user?.data?._id
        }`,
        updatedData,
        {
          headers: { "Content-Type": "application/json" },
          Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        }
      );
      if (response.status === 200 && response.data.success) {
        toast.success("Profile updated successfully!");
        window.location.reload();
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => onClose()} // Navigate back to dashboard on backdrop click
    >
      <div
        className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on content click
      >
        {/* Header */}
        <h3 className="text-xl font-bold text-base-content text-center mb-4">
          {user?.data?.username}
          {`'s`} Profile
        </h3>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="profilePicInput" className="cursor-pointer">
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    profilePicFile
                      ? URL.createObjectURL(profilePicFile) // Show preview if new file
                      : `${import.meta.env.VITE_BASE_PIC_URL}${
                          formData.profilePic
                        }` // Show existing picture
                  }
                  alt="Profile"
                  className="object-cover"
                  onError={(e) => {
                    e.target.src = "./avatar.svg"; // Fallback image
                  }}
                />
              </div>
            </div>
          </label>
          <input
            type="file"
            id="profilePicInput"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePicChange}
          />
          <p className="text-sm text-gray-500 mt-2">
            Click on the picture to upload a new one
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-base-content mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-base-content mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter email"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
