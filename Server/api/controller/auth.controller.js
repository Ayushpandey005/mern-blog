import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Required !",
      });
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
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error...",
      success: false,
      error,
    });
  }
};
