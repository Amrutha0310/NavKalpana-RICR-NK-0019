import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswers: [{ type: Number, required: true }], // Indices of options
  type: { type: String, enum: ["single", "multiple"], default: "single" },
  explanation: { type: String },
});

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    totalQuestions: { type: Number, default: 0 },
    questions: [questionSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

quizSchema.pre("save", function () {
  this.totalQuestions = this.questions.length;
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
