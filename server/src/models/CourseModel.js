import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    difficulty: String,
    content: String,
    videoUrl: String,
    notes: String,
    hasQuiz: Boolean,
  },
  { _id: false },
);

const moduleSchema = new mongoose.Schema({
  name: String,
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: String,
    thumbnail: String,
    modules: [moduleSchema],
    totalLessons: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
