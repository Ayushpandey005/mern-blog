import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      next(errorHandler(400, "All fields are required!"))
    }
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new userModel({
      username,
      email,
      password : hashedPassword
    });
    await newUser.save();
    res.json({
      success: true,
      message: "User Created Successfully!",
    });
  } catch (error) {
    next(error)
  }
};
