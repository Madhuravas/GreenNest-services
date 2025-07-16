const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validate = require("../Utils/validater");

authRouter.post("/register", async (req, res) => {
  try {
    const { name, emailId, password } = req.body;
    const allowData = ["_id", "name", "emailId"];
    if (!name || !emailId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    validate(req);

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      emailId,
      password: hashedPassword,
    });

    await newUser.save();

    const token = newUser.generateAuthToken();

    let userData = allowData.reduce((acc, key) => {
      acc[key] = newUser[key];
      return acc;
    }, {});

    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
      secure: true, // only over HTTPS
      sameSite: "strict",
    });

    res
      .status(201)
      .json({ message: "User registered successfully", data: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    const allowData = ["_id", "name", "emailId"];

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    let userData = allowData.reduce((acc, key) => {
      acc[key] = user[key];
      return acc;
    }, {});

    const token = user.generateAuthToken();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });
    res.json({ message: "You have logged in successfully", data: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = authRouter;
