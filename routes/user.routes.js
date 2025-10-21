import express from "express";
import { getUserData, userLogin, userRegister } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.get('/', verifyToken, getUserData);
userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);

export default userRouter;