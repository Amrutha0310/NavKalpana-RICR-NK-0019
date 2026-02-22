import mongoose from "mongoose";

const submissionSchema = mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String }, // Text input
    fileUrl: { type: String }, // File upload placeholder
    externalLink: { type: String },
    submissionTime: { type: Date, default: Date.now },
    isLate: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Not Submitted", "Submitted", "Late Submitted", "Evaluated"],
      default: "Submitted",
    },
    marks: { type: Number },
    feedback: { type: String },
  },
  { timestamps: true },
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
