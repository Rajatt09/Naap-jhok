import express from "express";
import Order from "../models/Order.js";
import Tailor from "../models/Tailor.js";
import { auth, isTailor } from "../middleware/auth.js";

const router = express.Router();

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      userId: req.userId,
    });

    await order.save();

    // Populate the order with user and tailor details
    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name email phone address")
      .populate("tailorId", "shopAddress");

    res.status(201).json(populatedOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
});

// Get user's orders
router.get("/user", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate({
        path: "tailorId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

// Get tailor's orders
router.get("/tailor", auth, isTailor, async (req, res) => {
  try {
    // First find the tailor document for this user
    const tailor = await Tailor.findOne({ userId: req.userId });
    if (!tailor) {
      return res.status(404).json({ message: "Tailor profile not found" });
    }

    const orders = await Order.find({ tailorId: tailor._id })
      .populate("userId", "name email phone address")
      .sort("-createdAt");
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

// Update order status
router.put("/:id/status", auth, isTailor, async (req, res) => {
  try {
    const { status } = req.body;

    // First find the tailor document for this user
    const tailor = await Tailor.findOne({ userId: req.userId });
    if (!tailor) {
      return res.status(404).json({ message: "Tailor profile not found" });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, tailorId: tailor._id },
      { status },
      { new: true }
    ).populate("userId", "name email phone address");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
});

router.get("/get-all-orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

// Get single order
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "tailorId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .populate("userId", "name email phone address");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user has permission to view this order
    const isOrderOwner = order.userId._id.toString() === req.userId;
    const isTailorOwner =
      order.tailorId &&
      order.tailorId.userId &&
      order.tailorId.userId._id.toString() === req.userId;

    if (!isOrderOwner && !isTailorOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
});

export default router;
