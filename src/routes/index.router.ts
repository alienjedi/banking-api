import express, { Request, Response, Router } from "express";

import userRouter from "./user.router";
import accountRouter from "./account.router";
import managerRouter from "./manager.router";

const indexRouter: Router = express.Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/account", accountRouter);
indexRouter.use("/manager", managerRouter);

export default indexRouter;
