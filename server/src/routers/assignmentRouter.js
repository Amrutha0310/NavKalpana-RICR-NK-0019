import express from "express";

import {
  getAssignments,
  submitAssignment,
  getSubmissions,
  evaluateSubmission,
} from "../controllers/assignmentController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAssignments);
router.post("/submit", protect, submitAssignment);
router.get("/submissions", protect, getSubmissions);
router.put("/:id/evaluate", protect, evaluateSubmission);

export default router;
