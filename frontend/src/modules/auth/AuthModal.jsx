/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const AuthModal = ({ mode, handleChange, handleSubmit, data, loading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-base-200 rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Header */}
        <form encType="multipart/form-data">
          <h3 className="text-xl font-bold mb-4 text-base-content">
            {mode === "signup" ? "Sign Up" : "Login"}
          </h3>

          <div className="flex flex-col gap-4">
            {/* Username */}
            {mode === "signup" && (
              <div>
                <label className="block font-semibold text-base-content">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  value={data?.username}
                  placeholder="Enter Username"
                  className="input input-bordered w-full mt-2"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-semibold text-base-content">
                Email
              </label>
              <input
                type="text"
                name="email"
                onChange={handleChange}
                value={data?.email}
                placeholder="Enter Email"
                className="input input-bordered w-full mt-2"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold text-base-content">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={data?.password}
                placeholder="Enter Password"
                className="input input-bordered w-full mt-2"
              />
            </div>

            {/* Profile Picture */}
            {mode === "signup" && (
              <div>
                <label className="block font-semibold text-base-content">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="profilePic"
                  onChange={handleChange}
                  className="file-input file-input-bordered w-full mt-2"
                  accept="image/png, image/jpeg"
                />
              </div>
            )}
          </div>

          {/* Link to sign up or Login */}
          <div className="mt-4">
            {mode === "signup" ? (
              <p className="text-sm text-base-content">
                {`Already have an account?`}{" "}
                <Link to="/login" className="text-primary">
                  Login
                </Link>
              </p>
            ) : (
              <p className="text-sm text-base-content">
                {`Don't have an account?`}{" "}
                <Link to="/signup" className="text-primary">
                  Sign Up
                </Link>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6 gap-3">
            <button className="btn btn-primary" onClick={handleSubmit}>
              {/* {mode === "signup" ? "Sign Up" : "Login"} */}
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : mode === "signup" ? (
                "Sign Up"
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
