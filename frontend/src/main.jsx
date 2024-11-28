import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthContextProvider } from "./context/AuthContextProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { AppProvider } from "./context/AppProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {/* Ensure persistor is passed */}
        <AuthContextProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthContextProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
