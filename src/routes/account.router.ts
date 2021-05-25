import express, { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import * as accountController from "../controllers/account.controller";

const accountRouter: Router = express.Router();

accountRouter.post("/create", authMiddleware, accountController.handleCreateAccount);
accountRouter.post("/deposit", authMiddleware, accountController.handleDeposit);
accountRouter.post("/withdraw", authMiddleware, accountController.handleWithdrawal);
accountRouter.post("/transfer", authMiddleware, accountController.handleTransfer);
accountRouter.post("/close", authMiddleware, accountController.handleCloseAccount);

export default accountRouter;
