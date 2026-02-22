import express from "express";

import {
  submitDoubt,
  getDoubts,
  getAttendance,
  resolveDoubt,
} from "../controllers/supportController";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/doubt", protect, submitDoubt);
router.get("/doubts", protect, getDoubts);
router.get("/attendance", protect, getAttendance);
router.put("/resolve/:id", protect, resolveDoubt);

export default router;
