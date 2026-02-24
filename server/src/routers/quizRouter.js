import express from "express";

import {
  getQuizzes,
  createQuiz,
  getQuizById,
  submitQuizAttempt,
  deleteQuiz
} from "../controllers/quizController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getQuizzes);
router.post("/", protect, createQuiz);
router.get("/:id", protect, getQuizById);
router.post("/submit", protect, submitQuizAttempt);
router.delete("/:id", protect, deleteQuiz);

export default router;
