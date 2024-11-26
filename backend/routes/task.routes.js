import express from "express";

import {
  createSubtask,
  createTask,
  deleteSubtask,
  deleteTask,
  editSubtask,
  editTask,
  getAllSubtasks,
  getAllTasks,
  getPopulatedTasks,
  getSingleSubtask,
  getSingleTask,
  getUserTasks,
} from "../controllers/task.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.patch("/edit/:id", authMiddleware, editTask);
router.delete("/delete/:id", authMiddleware, deleteTask);

router.get("/all", authMiddleware, getAllTasks);
router.get("/task/:id", authMiddleware, getSingleTask);
router.get("/users-tasks", authMiddleware, getUserTasks);

//Sub Tasks Routes:
router.post("/subtask/create/:taskId", authMiddleware, createSubtask);
router.patch("/subtask/edit/:id", authMiddleware, editTask);
router.delete("/subtask/delete/:id", authMiddleware, deleteTask);
router.get("/subtasks/:id", authMiddleware, getAllSubtasks);
router.get("/subtask/:id", authMiddleware, getSingleSubtask);
// router.delete("/delete/subtask/:id", authMiddleware, deleteSubtask);
// router.patch("/edit/subtask/:id", authMiddleware, editSubtask);

router.get("/populate/:id", getPopulatedTasks);

export default router;
