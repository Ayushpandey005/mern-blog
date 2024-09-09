import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

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


export const signin = async (req, res, next) => {
  const {email, password} = req.body
  if(!email || !password){
    next(errorHandler(400, "All Fields Are Required!"))
  }
  try {
    const validUser = await userModel.findOne({email})
    if(!validUser){
      return next(errorHandler(404, "User Not Found!"))
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password)
    if(!validPassword){
     return next(errorHandler(400, "Incorrect Email or Password!"))
    }
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET
    )
    const {password: pass, ...rest} = validUser._doc
    res.status(200).cookie("access_token", token, {
      httpOnly: true
    }).json(rest)
  } catch (error) {
    next(error)
  }
}
