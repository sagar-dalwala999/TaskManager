import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../../utils/axiosInstance";

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (formData) => {
    const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      body: formData, // Do not set Content-Type; `fetch` will handle it automatically for FormData
    });

    const data = await response.json();
    return data;
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }) => {
    const response = await fetch("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    return data;
  }
);

// Fetch user info
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await fetchData("/auth/get-user", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
    },
  });
  const data = await response.json();
  // console.log(data.data.role);
  return data;
});

//Fetch All users info
export const fetchAllUsers = createAsyncThunk(
  "options/fetchOptions",
  async () => {
    const response = await fetch("http://localhost:3000/api/v1/auth/get-all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
      },
    });

    const data = await response.json();

    return data;
  }
);

//Fetch multiple users by id
export const fetchUsersById = createAsyncThunk(
  "user/fetchUsersById",
  async (id) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/auth/get-users-id/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );

    const data = await response.json();

    return data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    userName: "",
    userId: "",
    profilePic: "",
    userRole: localStorage.getItem("userRole"),
    token: null, // Store the token in Redux state
    loading: false,
    error: null,
    users: [],
  },
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.token = null;
      state.userName = "";
      state.userId = "";
      state.profilePic = "";
      state.userRole = "";
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.data;
        state.token = action.payload.data.token;
        state.userName = action.payload.data.username;
        state.userId = action.payload.data._id;
        state.profilePic = action.payload.data.profilePic;
        state.userRole = action.payload.data.role;
        localStorage.setItem(
          "token",
          JSON.stringify(action.payload.data.token)
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userName = action.payload.username;
        state.userId = action.payload._id;
        state.profilePic = action.payload.profilePic;
        state.userRole = action.payload.data.role;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUsersById.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      });
  },
});

export const { logout, setUserRole } = userSlice.actions;
export default userSlice.reducer;
