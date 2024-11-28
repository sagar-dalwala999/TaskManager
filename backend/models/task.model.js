import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Ongoing"],
      default: "Pending",
    },
    type: {
      type: String,
      enum: ["Important", "Normal"],
      default: "Normal",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: [{ type: Schema.Types.ObjectId, ref: "User" }],
    subTasksId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    commentsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
