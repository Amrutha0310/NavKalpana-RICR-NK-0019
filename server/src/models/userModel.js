import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    fullName: {
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
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    enrolledCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "course",
        },
        progress: {
          type: Number,
          default: 0,
        },
        completedLessons: [{ type: String }],
        attendance: { type: Number, default: 0 },
      },
    ],
    learningStreak: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
    },
    skills: [{ type: String }],
    performance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
