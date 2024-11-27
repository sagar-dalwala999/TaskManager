import bcrypt from "bcrypt";

import { generateToken } from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
import handleResponse from "../utils/handleResponse.js";
import errorResponse from "../utils/ErrorResponse.js";
import mongoose from "mongoose";

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profilePic = `/uploads/${req.file.originalname}`;

    if (!username || !email || !password || !profilePic) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(res, 400, false, "User already exists.");
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic: profilePic,
    });

    generateToken(user._id, res);
    console.log(generateToken(user._id, res));

    return handleResponse(res, 200, true, "User created successfully.", user);
  } catch (error) {
    errorResponse(res, 500, false, error.message);
    console.log("Error in creating user: ", error.message);
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!username || !email) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    );

    return handleResponse(res, 200, true, "User edited successfully.", user);
  } catch (error) {
    console.log("Error in editing user: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};

export const editProfilePic = async (req, res) => {
  try {
    const { id } = req.params;

    const profilePic = `/uploads/${req.file.originalname}`;

    if (!profilePic) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { profilePic },
      { new: true }
    );

    return handleResponse(res, 200, true, "User edited successfully.", user);
  } catch (error) {
    console.log("Error in editing user: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        400,
        false,
        "Please provide all required fields."
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 400, false, "User not found.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(res, 400, false, "Invalid credentials.");
    }

    const token = generateToken(user._id, res);

    return handleResponse(res, 200, true, "User logged in successfully.", {
      ...user._doc,
      token,
    });
  } catch (error) {
    errorResponse(res, 500, false, error.message);
    console.log("Error in logging in user: ", error.message);
  }
};

export const logoutUser = async (req, res) => {
  try {
    return handleResponse(res, 200, true, "User logged out successfully.");
    // return res
    //   .status(200)
    //   .json({ success: true, message: "User logged out successfully." });
  } catch (error) {
    console.log("Error in logging out user: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return errorResponse(res, 404, false, "User not found.");
    }

    return handleResponse(res, 200, true, "User fetched successfully.", user);
  } catch (error) {
    errorResponse(res, 500, false, error.message);
    console.log("Error in getting user: ", error.message);
  }
};

export const createAdmin = async (req, res) => {
  try {
    // create admin user
    const adminUser = await User.findOne({ role: "admin" });

    const password = bcrypt.hashSync("admin123", 10);

    if (!adminUser) {
      const admin = await User.create({
        username: "admin",
        email: "admin@gmail.com",
        password: password,
        role: "admin",
        profilePic: "/uploads/admin.png",
      });

      if (admin) {
        console.log("Admin user created successfully.");
      }
    }
  } catch (error) {
    console.log("Error in creating admin: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .where("role")
      .ne("admin");

    if (!users) {
      return handleResponse(res, 404, false, "");
    }

    return handleResponse(res, 200, true, "Users fetched successfully.", users);
  } catch (error) {
    errorResponse(res, 500, false, error.message);
    console.log("Error in getting users: ", error.message);
  }
};

export const getUsersById = async (req, res) => {
  try {
    const { ids } = req.query; // Expecting comma-separated user IDs
    if (!ids) {
      return errorResponse(res, 400, false, "No user IDs provided.");
    }

    // Split and validate IDs
    const userIds = ids
      .split(",")
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id); // Convert valid IDs to ObjectId
        }
        return null; // Mark invalid IDs as null
      })
      .filter((id) => id !== null); // Filter out invalid IDs

    if (userIds.length === 0) {
      return errorResponse(res, 400, false, "No valid user IDs provided.");
    }

    // Query the database
    const users = await User.find({ _id: { $in: userIds } }).select(
      "username email profilePic"
    ); // Only select necessary fields

    if (!users || users.length === 0) {
      return errorResponse(res, 404, false, "Users not found.");
    }

    return handleResponse(res, 200, true, "Users fetched successfully.", users);
  } catch (error) {
    console.log("Error in getting users by ID: ", error.message);
    return errorResponse(res, 500, false, error.message);
  }
};
