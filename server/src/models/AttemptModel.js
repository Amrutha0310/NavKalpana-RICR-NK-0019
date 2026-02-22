import mongoose from "mongoose";

const attemptSchema = mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, 
        ref: "Quiz",
         required: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    incorrectCount: { type: Number, required: true },
    percentage: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Attempt = mongoose.model("Attempt", attemptSchema);
export default Attempt;
