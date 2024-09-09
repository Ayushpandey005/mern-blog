import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required!"));
    }

    // Check if the username already exists
    const existingUsername = await userModel.findOne({ username });
    if (existingUsername) {
      return next(errorHandler(400, "Username is already taken."));
    }

    // Check if the email already exists
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return next(errorHandler(400, "Email is already registered."));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create the new user
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user
    await newUser.save();

    // Respond with success message
    res.json({
      success: true,
      message: "User created successfully!",
    });
  } catch (error) {
    next(error); // Pass any errors to the error handler
  }
};
