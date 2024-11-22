import { SubTask } from "../models/subtask.model.js";
import errorResponse from "../utils/ErrorResponse.js";
import handleResponse from "../utils/handleResponse.js";

export const createSubtask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const { taskId } = req.params;

    if (!title || !description || !status || !taskId) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const subtask = await SubTask.create({
      title,
      description,
      status,
      taskId,
    });

    return handleResponse(
      res,
      200,
      true,
      "Subtask created successfully.",
      subtask
    );
  } catch (error) {
    console.log("Error in creating subtask: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};

export const editSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const subtask = await SubTask.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
      },
      { new: true }
    );

    return handleResponse(
      res,
      200,
      true,
      "Subtask edited successfully.",
      subtask
    );
  } catch (error) {
    console.log("Error in editing subtask: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};

export const deleteSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    const subtask = await SubTask.findByIdAndDelete(id);

    return handleResponse(
      res,
      200,
      true,
      "Subtask deleted successfully.",
      subtask
    );
  } catch (error) {
    console.log("Error in deleting subtask: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};

export const getAllSubtasksByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const subtasks = await SubTask.find().where("taskId").equals(taskId);

    if (!subtasks) {
      return handleResponse(res, 200, true, "");
    }

    return handleResponse(
      res,
      200,
      true,
      "Subtasks fetched successfully.",
      subtasks
    );
  } catch (error) {
    console.log("Error in getting subtasks: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};

export const getSingleSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    const subtask = await SubTask.findById(id);

    if (!subtask) {
      return errorResponse(res, 404, false, "Subtask not found.");
    }

    return handleResponse(
      res,
      200,
      true,
      "Subtask fetched successfully.",
      subtask
    );
  } catch (error) {
    console.log("Error in getting subtask: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};
