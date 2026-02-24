import express from "express";

import {
  getCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
  markLessonComplete,
  markCourseComplete,
  updateCourse,
  uploadFile,
} from "../controllers/courseController.js";
import protect from "../middlewares/authMiddleware.js"
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, getCourses);
router.post("/", protect, createCourse);
router.put("/:id", protect, updateCourse);
router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/:id", protect, getCourseById);
router.post("/:id/enroll", protect, enrollInCourse);
router.post("/lesson-complete", protect, markLessonComplete);
router.post("/course-complete", protect, markCourseComplete);

export default router;
