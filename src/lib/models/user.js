import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  normalizedUserName: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //   isAdmin: {
  //     type: Boolean,
  //     default: false,
  //   },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
