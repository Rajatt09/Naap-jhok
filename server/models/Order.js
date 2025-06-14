import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  fabric: {
    type: String,
    required: true,
  },
  measurements: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tailorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tailor",
      required: true,
    },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: [
        "placed",
        "accepted",
        "in-progress",
        "ready",
        "delivered",
        "rejected",
      ],
      default: "placed",
    },
    deliveryOption: {
      type: String,
      enum: ["pickup", "home_delivery"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "upi"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
