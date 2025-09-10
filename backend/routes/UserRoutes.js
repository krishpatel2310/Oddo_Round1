import express from "express";
import { registerUser, getAllUsers , getDashboardSummary } from "../controllers/UserController.js";
import  protect from "../middleware/auth.js";
const router = express.Router();

// POST /api/users
router.post("/", registerUser);

// GET /api/users
router.get("/", getAllUsers);
router.get("/summary", protect, getDashboardSummary);
export default router;

