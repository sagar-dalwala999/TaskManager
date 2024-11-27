import express from "express";

import {
  createSubtask,
  createTask,
  deleteTask,
  editTask,
  getAllSubtasks,
  getAllTasks,
  getAllTasksWithUsers,
  getSingleSubtask,
  getSingleTask,
  getTaskWithUserAndSubtasksAndComments,
  getUsersTasksWithUsers,
  getUserTasks,
} from "../controllers/task.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.delete("/delete/:id", authMiddleware, deleteTask);

router.patch("/edit/:id", authMiddleware, editTask);
router.get("/task/:id", authMiddleware, getSingleTask);
// router.get("/all", authMiddleware, getAllTasks);
// router.get("/users-tasks", authMiddleware, getUserTasks);

//? Routes that i have change with mongoose populate
//* for admin
router.get("/all", authMiddleware, getAllTasksWithUsers);
//* for user
router.get("/user-tasks", authMiddleware, getUsersTasksWithUsers);
//* for task drawer
router.get("/populate/:id", getTaskWithUserAndSubtasksAndComments);

//Sub Tasks Routes:
router.post("/subtask/create/:taskId", authMiddleware, createSubtask);
router.patch("/subtask/edit/:id", authMiddleware, editTask);
router.delete("/subtask/delete/:id", authMiddleware, deleteTask);
router.get("/subtasks/:id", authMiddleware, getAllSubtasks);
router.get("/subtask/:id", authMiddleware, getSingleSubtask);

export default router;
