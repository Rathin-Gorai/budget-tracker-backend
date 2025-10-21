import express from 'express';
import userRouter from './user.routes.js';
import categoriesRoutes from './categories.routes.js';
import verifyToken from '../middlewares/auth.js';
import transactionRoutes from './transactions.routes.js';
import budgetRoutes from './budget.routes.js';
import summaryRoutes from './summery.routes.js';
const routers = express.Router()

routers.use("/user", userRouter);
routers.use("/categories", verifyToken, categoriesRoutes);
routers.use("/transactions", verifyToken, transactionRoutes);
routers.use("/budget", verifyToken, budgetRoutes)
routers.use("/summary", verifyToken, summaryRoutes)

export default routers;