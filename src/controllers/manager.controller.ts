import { Request, Response } from "express";

import {
  update as updateAccount,
  findOne as findOneAccount,
  findAll as findAllAccounts,
  deleteOne as deleteAccount,
} from "../utilities/account.tools";
import {
  serverResponse,
  invalidParamsResponse,
  defualtFailureResponse,
  failedToFindAccountResponse,
} from "../utilities/server.response";
import { checkParams } from "../utilities/params.checkers";

export const handleCloseAccount = async (req: Request, res: Response) => {
  const requiredParams = ["accountNumber"];
  if (!checkParams) return invalidParamsResponse(res, requiredParams);

  const { accountNumber } = req.body;

  const account = await findOneAccount({ accountNumber: accountNumber });

  if (!account) return failedToFindAccountResponse(res);

  const deleteResult = await deleteAccount({ accountNumber: accountNumber });

  if (deleteResult) return defualtFailureResponse(res);

  serverResponse(res, 200, {
    payload: account,
    message: "Account close approved",
  });
};

export const handleGetCloseRequestedAccounts = async (
  req: Request,
  res: Response
) => {
  const accounts = await findAllAccounts({ accountPendingClose: true });

  serverResponse(res, 200, {
    payload: accounts,
    message: "Retrieved all accounts pending close",
  });
};

export const handleFreezeAccount = async (req: Request, res: Response) => {
  const requiredParams = ["accountNumber"];
  if (!checkParams) return invalidParamsResponse(res, requiredParams);

  const { accountNumber } = req.body;

  const account = await findOneAccount({ accountNumber: accountNumber });

  if (!account) return failedToFindAccountResponse(res);

  account.accountFrozen = true;

  const updateResult = await updateAccount(
    { accountNumber: accountNumber },
    account
  );

  if (!updateResult) return defualtFailureResponse(res);

  serverResponse(res, 200, {
    payload: account,
    message: "Account freeze complete",
  });
};

export const handleUnfreezeAccount = async (req: Request, res: Response) => {
  const { accountNumber } = req.body;

  const account = await findOneAccount({ accountNumber: accountNumber });

  if (!account) return failedToFindAccountResponse(res);

  account.accountFrozen = false;

  const updateResult = await updateAccount(
    { accountNumber: accountNumber },
    account
  );

  if (!updateResult) return defualtFailureResponse(res);

  serverResponse(res, 200, {
    payload: account,
    message: "Account unfreeze complete",
  });
};
