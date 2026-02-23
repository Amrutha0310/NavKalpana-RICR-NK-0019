import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String,
             required: true },
    description: { type: String,
             required: true },
    deadline: { type: Date,
              required: true },
  },
  { timestamps: true },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
