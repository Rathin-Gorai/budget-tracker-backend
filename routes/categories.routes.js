import express from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller.js";

const categoriesRoutes = express.Router();

categoriesRoutes.get("/", getCategories);
categoriesRoutes.post("/", createCategory);
categoriesRoutes.put("/:id", updateCategory);
categoriesRoutes.delete("/:id", deleteCategory);


export default categoriesRoutes;