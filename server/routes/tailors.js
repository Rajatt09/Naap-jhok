import express from "express";
import Tailor from "../models/Tailor.js";
import User from "../models/User.js";
import { auth, isTailor } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tailors = await Tailor.find().populate("userId", "name email phone");
    res.json(tailors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tailors", error: error.message });
  }
});

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 4 } = req.query;

    // Find tailors within the radius (in kilometers)
    const tailors = await Tailor.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      },
    }).populate("userId", "name email phone");

    res.json(tailors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error finding nearby tailors", error: error.message });
  }
});

router.get("/location", auth, isTailor, async (req, res) => {
  try {
    console.log("Fetching location for userId:", req.userId);
    const tailor = await Tailor.findOne({ userId: req.userId }).select(
      "location area"
    );

    if (!tailor) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    res.json(tailor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching location", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tailor = await Tailor.findById(req.params.id).populate(
      "userId",
      "name email phone"
    );

    if (!tailor) {
      return res.status(404).json({ message: "Tailor not found" });
    }

    res.json(tailor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tailor", error: error.message });
  }
});

router.put("/profile", auth, isTailor, async (req, res) => {
  try {
    console.log("req is : ", req.body);
    const tailor = await Tailor.findOneAndUpdate(
      { userId: req.userId },
      req.body.location,
      { new: true }
    );

    res.json(tailor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating tailor profile", error: error.message });
  }
});

export default router;
