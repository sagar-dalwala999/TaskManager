import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createSubtask,
  deleteSubtask,
  editSubtask,
  getAllSubtasksByTask,
  getSingleSubtask,
} from "../controllers/subtask.controller.js";

const router = express.Router();

router.post("/create/:taskId", authMiddleware, createSubtask);
router.patch("/edit/:id", authMiddleware, editSubtask);
router.delete("/delete/:id", authMiddleware, deleteSubtask);

router.get("/all/:taskId", authMiddleware, getAllSubtasksByTask);
router.get("/subtask/:id", authMiddleware, getSingleSubtask);

export default router;
