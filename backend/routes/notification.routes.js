import express from "express";
import {
  createCommentNotification,
  createSubtaskNotification,
  createTaskNotification,
  getUserNotifications,
  markNotificationsAsRead,
} from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Notification routes for User
router.get("/user-notifications/:userId", authMiddleware, getUserNotifications);
router.get(
  "/mark-notifications-as-read",
  authMiddleware,
  markNotificationsAsRead
);

// Notification routes for Task, SubTask, and Comment
router.get("/create-task-notification", authMiddleware, createTaskNotification);
router.get(
  "/create-subtask-notification",
  authMiddleware,
  createSubtaskNotification
);
router.get(
  "/create-comment-notification",
  authMiddleware,
  createCommentNotification
);

export default router;
