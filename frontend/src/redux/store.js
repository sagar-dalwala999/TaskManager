import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage
import userReducer from "./slices/userSlice";
import tasksReducer from "./slices/tasksSlice";
import commentsReducer from "./slices/commentsSlice"; // Your tasks slice

const persistConfig = {
  key: "root",          // Storage key prefix
  storage,              // Define storage type (localStorage)
  whitelist: ["user"],  // Only persist the `user` slice
};

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,  // Persist user slice
    tasks: tasksReducer,
    comments: commentsReducer,     // Do not persist tasks slice
  },
});

const persistor = persistStore(store);

export { store, persistor };
