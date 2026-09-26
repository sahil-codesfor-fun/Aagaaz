import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  whatsapp: { type: String },
  schoolName: { type: String },
  studentClass: { type: String },
  city: { type: String },
  address: { type: String },
  checkedIn: { type: Boolean, default: false },
});

const GuestSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      required: true,
    },

    registrationType: {
      type: String,
      enum: ["guest"],
      default: "guest",
    },

    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    schoolName: { type: String },
    studentClass: { type: String },
    city: { type: String },

    members: [MemberSchema],

    totalMembers: {
      type: Number,
      default: 1,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    totalAfterDiscount: {
      type: Number,
      default: 0,
    },

    appliedCoupon: {
      type: String,
      default: "",
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    utrNumber: {
      type: String,
      sparse: true,
      default: "",
    },

    qrCode: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },

    qrSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "guestDetails",
    timestamps: true,
  }
);

export default mongoose.models.GuestDetails ||
  mongoose.model("GuestDetails", GuestSchema);