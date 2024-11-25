import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import DBConnection from "./db/DBConnection.js";

import taskRouter from "./routes/task.routes.js";
import authRouter from "./routes/user.routes.js";
import subtaskRouter from "./routes/subtask.routes.js";
import commentRouter from "./routes/comment.routes.js";

import { createAdmin } from "./controllers/user.controller.js";

import bodyParser from "body-parser";

dotenv.config();
const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5000", // Your frontend URL
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(bodyParser.json()); // Applies to all routes, including file upload ones

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "/public/uploads")));
app.use("/comments", express.static(path.join(__dirname, "/public/comments")));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/subtasks", subtaskRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
  DBConnection();
  createAdmin();
});
