import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["task", "subtask", "comment"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User
    ref: "User",
    required: true,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Task
    ref: "Task",
    required: false,
  },
  subtaskId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Subtask
    ref: "Subtask",
    required: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
