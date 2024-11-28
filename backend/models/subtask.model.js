import mongoose, { Schema } from "mongoose";

const subtaskSchema = new Schema(
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
    taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    //! Change it to String Only because Task is One and Sub Task can be many.
    // userId: [{ type: Schema.Types.ObjectId, ref: "User",required: true }],
  },
  {
    timestamps: true,
  }
);

export const SubTask = mongoose.model("Subtask", subtaskSchema);
