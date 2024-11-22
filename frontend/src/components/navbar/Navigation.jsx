/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";

import Toggle from "../../theme/Toggle";
import { logout } from "../../redux/slices/userSlice";

const Navigation = ({ setTheme, theme, user }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };
  return (
    <div className="navbar bg-base-100 z-10">
      {/* Drawer for mobile */}
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center">
          {/* Hamburger Menu */}
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost drawer-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <a className="btn btn-ghost text-xl">TBSM</a>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-auto p-4">
            {/* Sidebar Content */}
            <div className="flex-1">
              <li>
                <button>Dashboard</button>
              </li>
              <li>
                <button>Add Task</button>
              </li>
            </div>
            {/* Theme Toggle and Profile in Drawer */}
            <div className="flex gap-2 flex-col mt-4 lg:hidden">
              <div className="border-y-2 border-base-300 pb-2">
                <Toggle theme={theme} setTheme={setTheme} />
              </div>
              <div className="border-b-2 border-base-300 pb-2">
                <div className="dropdown dropdown-top">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="Avatar"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <button className="justify-between">Profile</button>
                    </li>
                    <li>
                      <button>Settings</button>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>

      {/* Navbar Content for md and above */}
      <div className="hidden lg:flex lg:gap-4 me-6">
        {/* Theme Toggle for Desktop */}
        <Toggle theme={theme} setTheme={setTheme} />
        {/* Profile Picture */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt={user?.username}
                src={`http://localhost:3000${user?.profilePic}`}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <button className="justify-between">Profile</button>
            </li>
            <li>
              <button>Settings</button>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
