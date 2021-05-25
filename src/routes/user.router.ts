import express, { Router } from "express";

import * as userController from "../controllers/user.controller";

const userRouter: Router = express.Router();

userRouter.post("/signin", userController.handleSignIn);
userRouter.post("/signup", userController.handleSignUp);
userRouter.post("/resetPassword", userController.handlePasswordReset);
userRouter.post("/verifyResetPassword", userController.verifyPasswordReset);

export default userRouter;
