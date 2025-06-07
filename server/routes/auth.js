import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Tailor from "../models/Tailor.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, phone, role, address, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({
      email,
      password,
      name,
      phone,
      role,
      address,
      location,
    });

    await user.save();

    if (role === "tailor") {
      const { shopAddress, servicesOffered } = req.body;
      const tailor = new Tailor({
        userId: user._id,
        shopAddress,
        location,
        servicesOffered,
      });
      await tailor.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

export default router;
