import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema(
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
    date: { type: Date, default: Date.now },
    status: { type: String,
              enum: ["Present", "Absent"],
             required: true },
  },
  { timestamps: true },
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
