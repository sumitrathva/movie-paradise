import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Ensure "User" matches the user model name
    required: true
  },
  content: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ["tv", "movie"],
    required: true
  },
  mediaId: {
    type: String,
    required: true
  },
  mediaTitle: {
    type: String,
    required: true
  },
  mediaPoster: {
    type: String,
    required: true
  }
}, 
{
  ...modelOptions, 
  timestamps: true // ✅ Fix: Automatically adds `createdAt` & `updatedAt`
});

export default mongoose.model("Review", reviewSchema);
