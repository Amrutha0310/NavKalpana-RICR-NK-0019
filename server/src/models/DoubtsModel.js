import mongoose from "mongoose";

const doubtSchema = mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    topic: { type: String, required: true },
    description: { type: String, required: true },
    screenshot: { type: String }, // Placeholder for URL
    type: {
      type: String,
      enum: ["Doubt", "Backup Class Request"],
      default: "Doubt",
    },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
    teacherReply: { type: String },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const Doubt = mongoose.model("Doubt", doubtSchema);
export default Doubt;
