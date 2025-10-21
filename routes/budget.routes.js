import express from "express";
import { createBudget, deleteBudget, getBudget, updateBudget } from "../controllers/budget.controller.js";
const budgetRoutes = express.Router();

budgetRoutes.get('/:year/:month', getBudget);
budgetRoutes.post('/', createBudget);
budgetRoutes.post('/:year/:month', updateBudget);
budgetRoutes.delete('/:year/:month', deleteBudget);


export default budgetRoutes;