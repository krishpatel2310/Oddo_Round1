import express from "express";
import { registerUser, getAllUsers , getDashboardSummary } from "../controllers/UserController.js";

import auth from '../Middleware/auth.js';
const router = express.Router();

// Registration route - no auth required
router.post("/registerUser", registerUser);



router.get("/", auth, getAllUsers);
router.get("/summary", auth, getDashboardSummary);

export default router;

