import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

export const Tag = mongoose.models?.Tag || mongoose.model("Tag", tagSchema);
