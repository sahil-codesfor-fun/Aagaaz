import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  whatsapp: { type: String },
  state: { type: String },
  city: { type: String },
  schoolName: { type: String },
  isOtherSchool: { type: Boolean, default: false },
  studentClass: { type: String },
  schoolIdCard: { type: String },
  aadharCard: { type: String },
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
    state: { type: String },
    city: { type: String },
    schoolName: { type: String },
    isOtherSchool: { type: Boolean, default: false },
    studentClass: { type: String },
    schoolIdCard: { type: String },
    aadharCard: { type: String },
    rejectionReason: { type: String, default: "" },

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

GuestSchema.index({ createdAt: -1 });
GuestSchema.index({ _id: -1 });

export default mongoose.models.GuestDetails ||
  mongoose.model("GuestDetails", GuestSchema);