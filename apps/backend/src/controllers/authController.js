import User from "../models/User.js";
// import bcrypt from 'bcryptjs';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    // if (userExists) return res.status(400).json({ message: 'User already exists' });
    if (userExists)
      return res.status(409).json({
        message: "User already exists, you can login ",
        success: false,
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    // const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "Signup successfully", success: true });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Internal Server error", success: false });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const errorMsg =
      "Invalid credentials, please check your email and password";
    // if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user)
      return res.status(403).json({ message: errorMsg, success: false });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(403).json({ message: errorMsg, success: false });

    console.log("user", user);
    // const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1d",
    // });
    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET
    );
    // res.json({ token });
    // res.statue(200).json({message: "Login Successfully", token, user, success: true});
    res
      .status(200)
      // .json({ message: "Login Successfully", token: `Bearer ${token}`, user, success: true });
      .json({ message: "Login Successfully", token, user, success: true });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

