import { Task } from "../models/task.model.js";
import { Comment } from "../models/comments.model.js";
import { Notification } from "../models/notification.model.js";
import handleResponse from "../utils/handleResponse.js";

/**
 * Create a new notification and store it in the database.
 * @param {Object} params - Notification details.
 * @returns {Object} The created notification.
 */
export const createNotification = async ({
  type,
  message,
  recipient,
  taskId,
  subtaskId,
  commentId,
}) => {
  try {
    const notification = new Notification({
      type,
      message,
      recipient,
      taskId,
      subtaskId,
      commentId,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 }) // Most recent notifications first
      .limit(50); // Limit to 50 notifications

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body; // Array of notification IDs

    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};


export const createTaskNotification = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    const assignedUsers = task.userId; // Array of user IDs
    const notifications = [];

    for (const userId of assignedUsers) {
      const notification = await createNotification({
        type: "task",
        message: `A new task "${task.title}" was created.`,
        recipient: userId,
        taskId: task._id,
      });
      notifications.push(notification);
    }

    res.status(201).json({ task, notifications });
  } catch (error) {
    console.error("Error creating task notification:", error);
    res.status(500).json({ error: "Failed to create task notification" });
  }
};

export const createSubtaskNotification = async (req, res) => {
  try {
    const subtask = await Task.create(req.body);

    const assignedUsers = subtask.userId; // Array of user IDs
    const notifications = [];

    for (const userId of assignedUsers) {
      const notification = await createNotification({
        type: "subtask",
        message: `A new subtask "${subtask.title}" was created under task "${subtask.taskId}".`,
        recipient: userId,
        taskId: subtask.taskId,
        subtaskId: subtask._id,
      });
      notifications.push(notification);
    }

    res.status(201).json({ subtask, notifications });
  } catch (error) {
    console.error("Error creating subtask notification:", error);
    res.status(500).json({ error: "Failed to create subtask notification" });
  }
};

export const createCommentNotification = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);

    const mentionedUsers = comment.userId; // Array of mentioned user IDs
    const notifications = [];

    for (const userId of mentionedUsers) {
      const notification = await createNotification({
        type: "comment",
        message: `You were mentioned in a comment on task "${comment.taskId}".`,
        recipient: userId,
        taskId: comment.taskId,
        commentId: comment._id,
      });
      notifications.push(notification);
    }

    res.status(201).json({ comment, notifications });
  } catch (error) {
    console.error("Error creating comment notification:", error);
    res.status(500).json({ error: "Failed to create comment notification" });
  }
};
