import express from "express";
import { createTransaction, deleteTransaction, getTransactionById, getTransactions, updateTransaction } from "../controllers/transaction.controller.js";
const transactionRoutes = express.Router()

transactionRoutes.get("/", getTransactions);
transactionRoutes.get("/:id", getTransactionById);
transactionRoutes.post("/", createTransaction);
transactionRoutes.put("/:id", updateTransaction);
transactionRoutes.delete("/:id", deleteTransaction);

export default transactionRoutes