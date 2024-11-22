import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addTask = createAsyncThunk("tasks/addTask", async (data) => {
  const response = await fetch(`http://localhost:3000/api/v1/tasks/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
});

export const editTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, data }) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/edit/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  const response = await fetch(`http://localhost:3000/api/v1/tasks/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
    },
  });
  const data = await response.json();
  return data;
});

//Fetch Single Tasks
export const fetchSingleTask = createAsyncThunk(
  "tasks/fetchSingleTask",
  async (taskId) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/task/${taskId}`,
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

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async ({ tasksPerPage, currentPage, userRole }) => {
    const endpoint =
      userRole === "admin"
        ? `http://localhost:3000/api/v1/tasks/all?perPage=${tasksPerPage}&pageNo=${currentPage}`
        : `http://localhost:3000/api/v1/tasks/users-tasks?perPage=${tasksPerPage}&pageNo=${currentPage}`;
    const response = await fetch(endpoint, {
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

//Fetch users tasks
export const fetchUsersTasks = createAsyncThunk(
  "tasks/fetchUsersTasks",
  async () => {
    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/users-tasks`,
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

//Fetch subtasks
export const fetchSubTasks = createAsyncThunk(
  "tasks/fetchSubTasks",
  async (taskId) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/subtasks/${taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data.data);
    return data;
  }
);


//Fetch single subtask
export const fetchSingleSubTask = createAsyncThunk(
  "tasks/fetchSingleSubTask",
  async (subtaskId) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/tasks/subtask/${subtaskId}`,
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

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [], // Initialize as an empty array
    taskId: null,
    totalPages: 1,
    currentPage: 1,
    tasksPerPage: 15,
    loading: false,
    error: null,
    subtasks: [],
    subtask: null,
  },
  reducers: {
    setTasks(state, action) {
      state.tasks = action.payload;
    },
    setTaskId(state, action) {
      state.taskId = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setSubtasks(state, action) {
      state.subtasks = action.payload.data;
    },
    selectTask: (state, action) => {
      state.taskId = action.payload;
    },
    setSubtask: (state, action) => {
      state.subtask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data.tasks || [];
        state.totalPages = Math.ceil(
          action.payload.data.totalTasks / state.tasksPerPage
        );
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSingleTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // Save fetched task data
      })
      .addCase(fetchSingleTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSubTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.subtasks = action.payload.data || [];
      })
      .addCase(fetchSingleSubTask.fulfilled, (state, action) => {
        state.loading = false;
        state.subtask = action.payload.data || null;
      });
  },
});

export const {
  setCurrentPage,
  setTaskId,
  setLoading,
  setTasks,
  setSubtasks,
  selectTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
