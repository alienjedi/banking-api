import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware";
import { accessControlMiddleware } from "../middlewares/access.control.middleware";
import * as managerController from "../controllers/manager.controller";

const router = express.Router();

router.post(
  "/close",
  authMiddleware,
  accessControlMiddleware,
  managerController.handleCloseAccount
);
router.post(
  "/freeze",
  authMiddleware,
  accessControlMiddleware,
  managerController.handleFreezeAccount
);
router.post(
  "/unfreeze",
  authMiddleware,
  accessControlMiddleware,
  managerController.handleUnfreezeAccount
);
router.get(
  "/requests",
  authMiddleware,
  accessControlMiddleware,
  managerController.handleGetCloseRequestedAccounts
);

export default router;
