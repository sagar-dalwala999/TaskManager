import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createComment,
  deleteComment,
  editComment,
  getAllCommentsByTask,
  getSingleComment,
} from "../controllers/comment.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/comments/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/create/:taskId/:userId", authMiddleware, upload.single("image"), createComment);
router.patch("/edit/:id", authMiddleware, editComment);
router.delete("/delete/:id", authMiddleware, deleteComment);

router.get("/all/:taskId", authMiddleware, getAllCommentsByTask);
router.get("/comment/:id", authMiddleware, getSingleComment);

export default router;
