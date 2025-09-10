import express from "express";
import {
  createBudget,
  getAllBudgets,
  deleteBudget
} from "../controllers/BudgetController.js";

const router = express.Router();

// Create a new budget
router.post("/", createBudget);

// Get all budgets
router.get("/", getAllBudgets);

// Delete a budget by ID
router.delete("/:id", deleteBudget);

export default router;
