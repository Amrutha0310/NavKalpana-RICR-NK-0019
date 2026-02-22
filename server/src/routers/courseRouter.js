import express from "express";

import {
  getCourses,
  getCourseById,
  createCourse,
  markLessonComplete,
  markCourseComplete,
} from "../controllers/courseController";
import protect from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/", protect, getCourses);
router.post("/", protect, createCourse);
router.get("/:id", protect, getCourseById);
router.post("/:id/enroll", protect, enrollInCourse);
router.post("/lesson-complete", protect, markLessonComplete);
router.post("/course-complete", protect, markCourseComplete);

export default router;
