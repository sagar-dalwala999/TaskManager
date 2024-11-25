import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const useAuthContext = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("token")) || null
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContext, AuthContextProvider, useAuthContext };
