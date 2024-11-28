import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

import taskRouter from "./routes/task.routes.js";
import authRouter from "./routes/user.routes.js";
import subtaskRouter from "./routes/subtask.routes.js";
import commentRouter from "./routes/comment.routes.js";
import notificationRouter from "./routes/notification.routes.js";

import DBConnection from "./db/DBConnection.js";
import { createAdmin } from "./controllers/user.controller.js";
import { createNotification } from "./controllers/notification.controller.js";
import { Notification } from "./models/notification.model.js";
import { User } from "./models/user.model.js";
import { Task } from "./models/task.model.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json()); // Applies to all routes, including file upload ones
app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "/public/uploads")));
app.use("/comments", express.static(path.join(__dirname, "/public/comments")));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/subtasks", subtaskRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notifications", notificationRouter);

DBConnection();
createAdmin();

//* Socket.io setup:
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});

const findSocketByUserId = (userId) => {
  // Iterate over all connected sockets and find the one with the matching userId
  for (const [socketId, socket] of io.sockets.sockets.entries()) {
    if (socket.userId === userId) {
      return socket;
    }
  }
  return null; // Return null if the user is not online
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Store userId and role in socket instance when user connects
  socket.on("register", ({ userId, userRole }) => {
    socket.userId = userId;
    socket.userRole = userRole;

    // Emit to all connected users
    io.emit("register", { userId, userRole });

    // console.log(`User registered: ${userId}, Role: ${userRole}`);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // Task-related socket events
  socket.on("task-created", async (task) => {
    try {
      const assignedUsers = task.userId; // Array of user IDs

      for (const userId of assignedUsers) {
        const notification = await createNotification({
          type: "task",
          message: `A new task "${task.title}" was created.`,
          recipient: userId,
          taskId: task._id,
        });

        // Emit to specific user if online
        const userSocket = findSocketByUserId(userId);
        if (userSocket) {
          userSocket.emit("notification", notification);
        }
      }

      // console.log("Task created and notifications sent:", task);
    } catch (error) {
      console.error("Error handling task-created event:", error);
    }
  });

  //Updated Task-related socket events
  socket.on("task-updated", async (task) => {
    try {
      const assignedUsers = task.userId; // Array of user IDs

      for (const userId of assignedUsers) {
        const notification = await createNotification({
          type: "task",
          message: `A task "${task.title}" was updated.`,
          recipient: userId,
          taskId: task._id,
        });

        // Emit to specific user if online
        const userSocket = findSocketByUserId(userId);
        if (userSocket) {
          userSocket.emit("notification", notification);
        }
      }

      // console.log("Task updated and notifications sent:", task);
    } catch (error) {
      console.error("Error handling task-updated event:", error);
    }
  });

  // Subtask-related socket events
  socket.on("subtask-created", async ({ subtask }) => {
    try {
      const assignedUsers = subtask.userId; // Array of user IDs

      // Fetch the parent task
      const parentTask = await Task.findById(subtask.subTasksId);

      for (const userId of assignedUsers) {
        const notification = await createNotification({
          type: "subtask",
          message: `A new subtask "${subtask.title}" was created under task "${parentTask.title}".`,
          recipient: userId,
          subtaskId: subtask._id,
          taskId: subtask.subTasksId, // Link to the parent task
        });

        // Emit to specific user if online
        const userSocket = findSocketByUserId(userId);
        if (userSocket) {
          userSocket.emit("notification", notification);
        }
      }

      console.log("Subtask created and notifications sent:", subtask);
    } catch (error) {
      console.error("Error handling subtask-created event:", error);
    }
  });

  //Updated Subtask-related socket events
  socket.on("subtask-updated", async (subtask) => {
    try {
      const assignedUsers = subtask.userId; // Array of user IDs

      // Fetch the parent task
      const parentTask = await Task.findById(subtask.subTasksId);

      for (const userId of assignedUsers) {
        const notification = await createNotification({
          type: "subtask",
          message: `A subtask "${subtask.title}" was updated under task "${parentTask.title}".`,
          recipient: userId,
          subtaskId: subtask._id,
          taskId: subtask.subTasksId, // Link to the parent task
        });

        // Emit to specific user if online
        const userSocket = findSocketByUserId(userId);
        if (userSocket) {
          userSocket.emit("notification", notification);
        }
      }

      // console.log("Subtask updated and notifications sent:", subtask);
    } catch (error) {
      console.error("Error handling subtask-updated event:", error);
    }
  });

  // Comment-related socket events
  socket.on("comment-created", async ({ comment, usersId, authorId }) => {
    try {
      const mentionedUsers = usersId; // Array of mentioned user IDs

      // Fetch the User by ID (author of the comment)
      const user = await User.findById(authorId);

      // Fetch the admin user ID from the database
      const admin = await User.findOne({ role: "admin" }); // Adjust query to match your schema
      const adminUserId = admin ? admin._id.toString() : null; // Use the admin's user ID if found, or null if not

      // Send notifications to mentioned users (excluding the author of the comment)
      for (const userId of mentionedUsers) {
        if (userId === authorId) continue; // Skip the author of the comment

        const notification = await createNotification({
          type: "comment",
          message: `A new comment was made by "${user?.username}": "${comment.text}".`,
          recipient: userId,
          commentId: comment._id,
          taskId: comment.taskId, // Link to the task
          subtaskId: comment.subtaskId, // Optional link to the subtask
        });

        // Emit to specific user if online
        const userSocket = findSocketByUserId(userId);
        if (userSocket) {
          userSocket.emit("notification", notification);
        }
      }

      if (adminUserId !== authorId) {
        const notification = await createNotification({
          type: "comment",
          message: `A new comment was made by ${user?.username}: "${comment.text}".`,
          recipient: adminUserId,
          commentId: comment._id,
          taskId: comment.taskId, // Link to the task
          subtaskId: comment.subtaskId, // Optional link to the subtask
        });

        const userSocket = findSocketByUserId(adminUserId);
        if (userSocket) {
          userSocket.emit("notification", notification);
        }
      }

      // console.log("Comment created and notifications sent:", comment);
    } catch (error) {
      console.error("Error handling comment-created event:", error);
    }
  });

  //Updated Comment-related socket events
  socket.on("comment-updated", async (comment, usersId) => {
    try {
      const mentionedUsers = usersId; // Array of user IDs

      // Fetch the User by ID (author of the comment)
      const user = await User.findById(authorId);

      // Send notifications to mentioned users (excluding the author of the comment)
      for (const userId of mentionedUsers) {
        if (userId === authorId) continue; // Skip the author of the comment

        const notification = await createNotification({
          type: "comment",
          message: `A new comment was made by "${user?.username}": "${comment.text}".`,
          recipient: userId,
          commentId: comment._id,
          taskId: comment.taskId, // Link to the task
          subtaskId: comment.subtaskId, // Optional link to the subtask
        });

        // Emit to specific user if online
        const userSocket = findSocketByUserId(userId);
        if (userSocket) {
          userSocket.emit("notification", notification);
        }
      }

      if (adminUserId !== authorId) {
        const notification = await createNotification({
          type: "comment",
          message: `A new comment was made by ${user?.username}: "${comment.text}".`,
          recipient: adminUserId,
          commentId: comment._id,
          taskId: comment.taskId, // Link to the task
          subtaskId: comment.subtaskId, // Optional link to the subtask
        });

        const userSocket = findSocketByUserId(adminUserId);
        if (userSocket) {
          userSocket.emit("notification", notification);
        }
      }

      // console.log("Comment updated and notifications sent:", comment);
    } catch (error) {
      console.error("Error handling comment-updated event:", error);
    }
  });

  // Fetch notifications for the connected user
  socket.on("fetch-notifications", async ({ userId }) => {
    try {
      // Fetch the user's notifications from the database
      const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 }) // Most recent first
        .limit(50); // Limit to 50 notifications

      // Emit the notifications back to the specific user
      socket.emit("notifications", notifications);
      // console.log(`Sent notifications to user ${userId}`);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      socket.emit("error", { message: "Failed to fetch notifications" });
    }
  });

  // Delete a notifications after it has been read
  socket.on("read-notifications", async ({ userId, notificationIds }) => {
    console.log("Read notifications:", notificationIds);

    try {
      await Notification.deleteMany({
        _id: { $in: notificationIds },
        recipient: userId,
      });
      console.log(`Notification ${notificationIds} deleted`);
    } catch (error) {
      console.error("Error deleting notification:", error);
      socket.emit("error", { message: "Failed to delete notification" });
    }
  });

  // Delete a notification after it has been read
  socket.on("read-notification", async ({ userId, notificationId }) => {
    console.log("Read notifications:", notificationId);

    try {
      await Notification.deleteMany({
        _id: { $in: notificationId },
        recipient: userId,
      });
      console.log(`Notification ${notificationId} deleted`);
    } catch (error) {
      console.error("Error deleting notification:", error);
      socket.emit("error", { message: "Failed to delete notification" });
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
