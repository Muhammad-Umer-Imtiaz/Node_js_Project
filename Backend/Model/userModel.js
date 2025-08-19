import mongoose from "mongoose";

const signupSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetPasswordExpire: {
      type: Date,
    },
    resetPasswordToken: { type: String },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", signupSchema);
