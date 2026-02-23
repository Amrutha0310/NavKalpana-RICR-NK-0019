import express from "express";

import {
  getStudentDashboard,
  getTeacherDashboard,
  getLeaderboard,
} from "../controllers/userController.js";
// import { UserLogin, UserRegister } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.post("/register", UserRegister);
// router.post("/login", UserLogin);
router.get("/dashboard", protect, getStudentDashboard);
router.get("/teacher-dashboard", protect, getTeacherDashboard);
router.get("/leaderboard", protect, getLeaderboard);

export default router;
