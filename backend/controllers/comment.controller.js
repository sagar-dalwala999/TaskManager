import { Comment } from "../models/comments.model.js";
import { Task } from "../models/task.model.js";
import errorResponse from "../utils/ErrorResponse.js";
import handleResponse from "../utils/handleResponse.js";

export const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { taskId, userId } = req.params;

    if (!userId || !taskId || (!text && !req.file)) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    console.log(req.file); // Log the file to ensure multer is working

    // Handle image file
    const image = req.file ? `/comments/${req.file.filename}` : ""; // Use `filename`, not `originalname`

    // Create the comment
    const comment = await Comment.create({
      text,
      image,
      userId,
      taskId,
    });

    // Update the Task model to include the new comment ID
    await Task.findByIdAndUpdate(
      taskId,
      { $push: { commentsId: comment._id } }, // Push the comment ID to the commentsId array
      { new: true, useFindAndModify: false } // Return the updated document
    );

    return handleResponse(
      res,
      200,
      true,
      "Comment created successfully and added to task.",
      comment
    );
  } catch (error) {
    console.log("Error in creating comment: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};


export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    // Find and update the comment
    const comment = await Comment.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );

    if (!comment) {
      return errorResponse(res, 404, false, "Comment not found.");
    }

    return handleResponse(
      res,
      200,
      true,
      "Comment edited successfully.",
      comment
    );
  } catch (error) {
    console.log("Error in editing comment: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return errorResponse(res, 404, false, "Comment not found.");
    }

    return handleResponse(
      res,
      200,
      true,
      "Comment deleted successfully.",
      comment
    );
  } catch (error) {
    console.log("Error in deleting comment: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};

export const getAllCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find()
      .where("taskId", "subtaskId")
      .equals(taskId, null);

    if (comments.length === 0) {
      return handleResponse(res, 200, true, "No comments available.", []);
    }

    return handleResponse(
      res,
      200,
      true,
      "Comments fetched successfully.",
      comments
    );
  } catch (error) {
    console.log("Error in getting comments: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};

export const getSingleComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return errorResponse(res, 404, false, "Comment not found.");
    }

    return handleResponse(
      res,
      200,
      true,
      "Comment fetched successfully.",
      comment
    );
  } catch (error) {
    console.log("Error in getting comment: ", error);
    return errorResponse(res, 500, false, error.message);
  }
};
