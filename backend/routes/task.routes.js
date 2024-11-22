import express from "express";

import {
  createTask,
  deleteSubtask,
  deleteTask,
  editSubtask,
  editTask,
  getAllSubtasks,
  getAllTasks,
  getSingleSubtask,
  getSingleTask,
  getUserTasks,
} from "../controllers/task.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.patch("/edit/:id", authMiddleware, editTask);
router.delete("/delete/:id", authMiddleware, deleteTask);

// router.post("/all", authMiddleware, getAllTasks);
// router.post("/all", getAllTasks);

router.get("/all", authMiddleware, getAllTasks);
router.get("/task/:id", authMiddleware, getSingleTask);
router.get("/users-tasks", authMiddleware, getUserTasks);

//Sub Tasks Routes:
router.get("/subtasks/:id", authMiddleware, getAllSubtasks);
router.get("/subtask/:id", authMiddleware, getSingleSubtask);
// router.delete("/delete/subtask/:id", authMiddleware, deleteSubtask);
// router.patch("/edit/subtask/:id", authMiddleware, editSubtask);

export default router;
