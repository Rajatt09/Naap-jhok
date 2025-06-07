import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  openTime: String,
  closeTime: String,
});

const tailorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shopAddress: {
    type: String,
    required: true,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  servicesOffered: [
    {
      type: String,
    },
  ],
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  shopImages: [String],
  priceRange: String,
  isShopOpen: {
    type: Boolean,
    default: true,
  },
  availability: [availabilitySchema],
  maxOrdersPerDay: {
    type: Number,
    default: 10,
  },
  currentOrders: {
    type: Number,
    default: 0,
  },
});

// Index for geospatial queries
tailorSchema.index({ location: "2dsphere" });

export default mongoose.model("Tailor", tailorSchema);
