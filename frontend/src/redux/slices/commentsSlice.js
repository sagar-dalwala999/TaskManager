import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ data }) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/comments/create`,
      {
        method: "POST",
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

export const editComment = createAsyncThunk(
  "comments/editComment",
  async ({ id, data }) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/comments/edit/${id}`,
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

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/comments/delete/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    const result = await response.json();
    return result;
  }
);

//Fetch Single Comments
export const fetchSingleComment = createAsyncThunk(
  "comments/fetchSingleComment",
  async (commentId) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/comments/comment/${commentId}`,
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

//Fetch All Comments
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (taskId) => {
    const response = await fetch(
      `http://localhost:3000/api/v1/comments/all/${taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data;
  }
);

// Slice
const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    commentId: null,
    loading: false,
    error: null,
    comment: null,
    commentsData:[],
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setCommentId(state, action) {
      state.commentId = action.payload;
    },
    setComments(state, action) {
      state.comments = action.payload;
    },
    setComment(state, action) {
      state.comment = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.comments.push(action.payload);
      state.loading = false;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.comments = action.payload.data;
      state.commentsData = action.payload.data;
      state.loading = false;
    });
    builder.addCase(fetchSingleComment.fulfilled, (state, action) => {
      state.comment = action.payload;
      state.loading = false;
    });
    builder.addCase(editComment.fulfilled, (state, action) => {
      state.comments = state.comments.map((comment) =>
        comment._id === action.payload._id ? action.payload : comment
      );
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload._id
      );
    });
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setCommentId, setComments, setComment } =
  commentsSlice.actions;

export default commentsSlice.reducer;
