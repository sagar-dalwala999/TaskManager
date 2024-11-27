import express from "express";
import multer from "multer";

import {
  createUser,
  editProfilePic,
  editUser,
  getAllUsers,
  getUser,
  getUsersById,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/signup", upload.single("profilePic"), createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/get-user", authMiddleware, getUser);
router.get("/get-all", authMiddleware, getAllUsers);
router.get("/get-users-id", authMiddleware, getUsersById);

router.patch("/edit-user/:id", editUser);

router.patch(
  "/edit-profile-pic/:id",
  upload.single("profilePic"),
  editProfilePic
);

export default router;
