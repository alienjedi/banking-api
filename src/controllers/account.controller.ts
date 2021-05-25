import { Request, Response } from "express";

import { AccountModel } from "../models/account.model";
import { AccountTypes } from "../config/account.types";
import {
  serverResponse,
  frozenAccountResponse,
  invalidParamsResponse,
  defualtFailureResponse,
  inactiveAccountResponse,
  failedToFindAccountResponse,
  insufficientAccountBalanceResponse,
  failedToFindPhoneNumberResponse,
} from "../utilities/server.response";
import {
  findOne,
  save,
  update,
  transact,
  generateAccountNumber,
} from "../utilities/account.tools";
import { checkParams } from "../utilities/params.checkers";
import { findOne as findUser } from "../utilities/user.tools";

// Should return the account number in the response
export const handleCreateAccount = async (req: Request, res: Response) => {
  const requiredParams = ["accountType", "accountHolderPhone"];
  if (!checkParams(req.body, requiredParams))
    return invalidParamsResponse(res, requiredParams);

  const { accountType, accountHolderPhone } = req.body;

  const accountHolder: any | null | Document = await findUser({
    phone: accountHolderPhone,
  });

  if (!accountHolder) return failedToFindPhoneNumberResponse(res);

  const accountNumber: any = generateAccountNumber();

  const newAccount = new AccountModel({
    accountType: accountType,
    accountNumber: accountNumber,
    accountBaseBalance: AccountTypes[accountType].accountBaseBalance,
    accountHolderId: accountHolder._id,
  });

  const saveResult = save(newAccount);

  if (!saveResult) return defualtFailureResponse;

  return serverResponse(res, 201, {
    payload: {
      accountNumber: accountNumber,
    },
    message: `New account created for user with phone number ${accountHolder.phone}`,
  });
};

export const handleDeposit = async (req: Request, res: Response) => {
  const requiredParams = ["accountNumber", "depositAmount"];
  if (!checkParams(req.body, requiredParams))
    return invalidParamsResponse(res, requiredParams);

  const { accountNumber, depositAmount } = req.body;

  const account: any | null | Document = await findOne({
    accountNumber: accountNumber,
  });

  if (!account) return failedToFindAccountResponse(res);

  if (account.accountFrozen) return frozenAccountResponse(res);

  account.accountBalance += depositAmount;

  // Make account active once the first deposit is made and balance is greater or equal to base balance
  if (
    !account.accountActive &&
    account.accountBalance >= account.accountBaseBalance
  )
    account.accountActive = true;

  const updateResult = await update({ accountNumber: accountNumber }, account);

  if (!updateResult) return defualtFailureResponse(res);

  return serverResponse(res, 200, {
    payload: account,
    message: `${depositAmount} GHS deposit transaction complete`,
  });
};

export const handleWithdrawal = async (req: Request, res: Response) => {
  const requiredParams = ["accountNumber", "withdrawalAmount"];
  if (!checkParams(req.body, requiredParams))
    return invalidParamsResponse(res, requiredParams);

  const { accountNumber, withdrawalAmount } = req.body;

  const account: any | null | Document = await findOne({
    accountNumber: accountNumber,
  });

  if (!account) return failedToFindAccountResponse(res);

  if (!account.accountActive) return inactiveAccountResponse(res);

  if (account.accountFrozen) return frozenAccountResponse(res);

  if (
    account.accountBalance < withdrawalAmount ||
    account.accountBalance - withdrawalAmount < account.accountBaseBalance
  )
    return insufficientAccountBalanceResponse(res);

  account.accountBalance -= withdrawalAmount;

  const updateResult = await update({ accountNumber: accountNumber }, account);

  if (!updateResult) return defualtFailureResponse(res);

  return serverResponse(res, 200, {
    payload: account,
    message: `${withdrawalAmount} GHS withdrawal transaction complete`,
  });
};

export const handleTransfer = async (req: Request, res: Response) => {
  const requiredParams = [
    "senderAccountNumber",
    "recipientAccountNumber",
    "transferAmount",
  ];
  if (!checkParams(req.body, requiredParams))
    return invalidParamsResponse(res, requiredParams);

  const { senderAccountNumber, recipientAccountNumber, transferAmount } =
    req.body;

  const senderAccount: any | null | Document = await findOne({
    accountNumber: senderAccountNumber,
  });

  const recipientAccount: any | null | Document = await findOne({
    accountNumber: recipientAccountNumber,
  });

  if (!(senderAccount && recipientAccount))
    return failedToFindAccountResponse(res);

  if (!(senderAccount.accountActive && recipientAccount.accountActive))
    return inactiveAccountResponse(res);

  if (senderAccount.accountFrozen || recipientAccount.accountFrozen)
    return frozenAccountResponse(res);

  if (
    senderAccount.accountBalance < transferAmount ||
    senderAccount.accountBalance - transferAmount <
      senderAccount.accountBaseBalance
  )
    return insufficientAccountBalanceResponse(res);

  senderAccount.accountBalance -= parseInt(transferAmount);
  recipientAccount.accountBalance += parseInt(transferAmount);

  const transactionResult = await transact(
    { accountNumber: senderAccountNumber },
    { accountNumber: recipientAccountNumber },
    senderAccount,
    recipientAccount
  );

  if (!transactionResult) return defualtFailureResponse(res);

  return serverResponse(res, 200, {
    payload: senderAccount,
    message: `${transferAmount} GHS transfer transaction complete`,
  });
};

export const handleCloseAccount = async (req: Request, res: Response) => {
  const requiredParams = ["accountNumber"];
  if (!checkParams(req.body, requiredParams))
    return invalidParamsResponse(res, requiredParams);

  const { accountNumber } = req.body;

  const account = await findOne({ accountNumber: accountNumber });

  if (!account) return failedToFindAccountResponse(res);

  if (account.accountFrozen) return frozenAccountResponse(res);

  account.accountPendingClose = true;

  const updateResult = await update({ accountNumber: accountNumber }, account);

  if (!updateResult) return defualtFailureResponse(res);

  serverResponse(res, 202, {
    payload: account,
    message: "Close account requested. Awaiting manager approval",
  });
};
