import { Task } from "../models/task.model.js";
import errorResponse from "../utils/ErrorResponse.js";
import handleResponse from "../utils/handleResponse.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, type, status, userId } = req.body;

    const subTasksId = req.body.subTasksId || null;

    if (!title || !description || !type || !status || !userId) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const task = await Task.create({
      title,
      description,
      status,
      type,
      userId,
      subTasksId,
    });

    return handleResponse(res, 200, true, "Task created successfully.", task);
  } catch (error) {
    return errorResponse(res, 500, false, error.message);
  }
};

export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, status, userId, commentsId } = req.body;

    if (!title || !description || !type || !status) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const task = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        type,
        status,
        userId,
        commentsId,
      },
      { new: true }
    );

    return handleResponse(res, 200, true, "Task edited successfully.", task);
  } catch (error) {
    return errorResponse(res, 500, false, error.message);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    return handleResponse(res, 200, true, "Task deleted successfully.", task);
  } catch (error) {
    return errorResponse(res, 500, false, error.message);
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments()
      .where("subTasksId")
      .equals(null);

    // Define the number of tasks per page by default to 6 if not provided
    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 6;

    // Page number from which page to start
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 1;

    // Sorting order for status
    const statusOrder = { Pending: 0, Ongoing: 1, Completed: 2 };

    // Find tasks and sort them first by status and then by type
    const tasks = await Task.find({ subTasksId: null })
      .sort([
        ["status", "desc"], // Sort by status first (ascending: Pending -> Ongoing -> Completed)
        ["type", "asc"], // Then sort by type (Important -> Normal)
        ["createdAt", "desc"], // Sort by createdAt descending for tasks of the same status
      ])
      .skip((pageNo - 1) * perPage)
      .limit(perPage);

    return handleResponse(res, 200, true, "Tasks fetched successfully.", {
      tasks,
      totalTasks,
    });
  } catch (error) {
    return errorResponse(res, 500, false, error.message);
  }
};

export const getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return errorResponse(res, 404, false, "Task not found.");
    }

    return handleResponse(res, 200, true, "Task fetched successfully.", task);
  } catch (error) {
    return errorResponse(res, 500, false, error.message);
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTasks = await Task.countDocuments()
      .where("userId")
      .equals(userId)
      .where("subTasksId")
      .equals(null);

    //! This defines the number of tasks per page by default 6
    const perPage = req.query.perPage ? parseInt(req.query.perPage) : 6;

    //! PageNumber From Which Page to Start
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 1;

    // Sorting order for status
    const statusOrder = { pending: 0, inProgress: 1, completed: 2 };

    // Find and sort tasks by status, type, and creation date
    const tasks = await Task.find({ userId, subTasksId: null })
      .sort([
        ["status", "desc"], // First by status: pending -> inProgress -> completed
        ["type", "asc"], // Then by type: Important -> Normal
        ["createdAt", "desc"], // Then by createdAt descending (newer first)
      ])
      .skip((pageNo - 1) * perPage)
      .limit(perPage);

    if (!tasks || tasks.length === 0) {
      return errorResponse(res, 404, false, "No tasks found.");
    }

    return handleResponse(res, 200, true, "Tasks fetched successfully.", {
      tasks,
      totalTasks,
    });
  } catch (error) {
    console.log("Error in getting user tasks: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};

export const getPopulatedTasks = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, 404, false, "Tasks not found.");
    }

    const tasks = await Task.find({
      _id: id,
    }).populate("userId");

    return handleResponse(res, 200, true, "Tasks fetched successfully.", tasks);
  } catch (error) {
    return errorResponse(res, 500, false, error.message);
  }
};

// SubTasks Controller:

export const createSubtask = async (req, res) => {
  try {
    const { title, description, type, status, userId } = req.body;

    const { taskId: subTasksId } = req.params || null;

    if (!title || !description || !type || !status || !userId || !subTasksId) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const subtask = await Task.create({
      title,
      description,
      status,
      type,
      userId,
      subTasksId,
    });

    return handleResponse(
      res,
      200,
      true,
      "Sub Task created successfully.",
      subtask
    );
  } catch (error) {
    return errorResponse(res, 500, false, error.message);
  }
};

export const getAllSubtasks = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return errorResponse(res, 404, false, "Subtasks not found.");
    }

    // Sorting order for status
    const statusOrder = { pending: 0, inProgress: 1, completed: 2 };

    const subtasks = await Task.find({ subTasksId: id }).sort([
      ["status", "asc"], // First by status: pending -> inProgress -> completed
      ["type", "asc"], // Then by type: Important -> Normal
      ["createdAt", "desc"], // Then by createdAt descending (newer first)
    ]);

    if (!subtasks || subtasks.length === 0) {
      return errorResponse(res, 404, false, "Subtasks not found.");
    }

    return handleResponse(
      res,
      200,
      true,
      "Subtasks fetched successfully.",
      subtasks
    );
  } catch (error) {
    console.log("Error in getting subtasks: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};

export const getSingleSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    const subtask = await Task.findById(id);

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
    console.log("Error in getting subtask: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};

export const deleteSubtask = async (req, res) => {
  try {
    const { id } = req.params;

    const subtask = await Task.findByIdAndDelete(id);

    return handleResponse(
      res,
      200,
      true,
      "Subtask deleted successfully.",
      subtask
    );
  } catch (error) {
    console.log("Error in deleting subtask: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};

export const editSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, status, userId, commentsId } = req.body;

    if (!title || !description || !type || !status) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const subTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        type,
        status,
        userId,
        commentsId,
      },
      { new: true }
    );

    return handleResponse(
      res,
      200,
      true,
      "Subtask edited successfully.",
      subTask
    );
  } catch (error) {
    return errorResponse(res, 500, false, error.message);
  }
};
