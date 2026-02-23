import express from "express";

import {
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
} from "../controllers/quizController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getQuizzes);
router.get("/:id", protect, getQuizById);
router.post("/submit", protect, submitQuizAttempt);

export default router;
