import bcrypt from "bcrypt";
import { Document } from "mongoose";
import { Request, Response } from "express";

import {
  serverResponse,
  invalidParamsResponse,
  defualtFailureResponse,
  invalidResetCodeResponse,
  userAlreadyExistsResponse,
  failedPasswordValidationResponse,
  failedToFindPhoneNumberResponse,
} from "../utilities/server.response";
import { checkParams } from "../utilities/params.checkers";
import { generateToken } from "../utilities/jwt.token";
import {
  findOne,
  save,
  update,
  userExists,
  generateResetCode,
} from "../utilities/user.tools";
import { sendMessage } from "../utilities/text.messenger";
import { encryptPassword, verifyPassword } from "../utilities/bcrypt.hash";

export const handleSignUp = async (req: Request, res: Response) => {
  const requiredParams = ["phone", "password", "isManager"];
  if (!checkParams(req.body, requiredParams)) {
    return invalidParamsResponse(res, requiredParams);
  }

  const { phone, password, isManager } = req.body;

  if (await userExists(phone)) return userAlreadyExistsResponse(res);

  const saveSuccess: boolean = await save({
    phone: phone,
    password: password,
    isManager: isManager,
  });

  if (!saveSuccess) defualtFailureResponse(res);

  return serverResponse(res, 201, {
    payload: null,
    message: `New ${(isManager && "manager") || "user"} created`,
  });
};

export const handleSignIn = async (req: Request, res: Response) => {
  const requiredParams = ["phone", "password"];
  if (!checkParams(req.body, requiredParams))
    return invalidParamsResponse(res, requiredParams);

  const { phone, password } = req.body;

  const user: any | null | Document = await findOne({ phone: phone });

  if (!user) return failedToFindPhoneNumberResponse(res);

  const result: boolean = await verifyPassword(password, user.password);

  if (!result) return failedPasswordValidationResponse(res);

  const userToken: string = generateToken(phone);

  return serverResponse(res, 200, {
    payload: { user, token: userToken },
    message: "Signin successful",
  });
};

export const handlePasswordReset = async (req: Request, res: Response) => {
  const requiredParams = ["phone"];
  if (!checkParams(req.body, requiredParams))
    return invalidParamsResponse(res, requiredParams);

  const { phone } = req.body;

  const resetCode: string = generateResetCode();

  const user: any | null | Document = await findOne({ phone: phone });

  if (!user) return failedToFindPhoneNumberResponse(res);

  user.pwdResetCode = resetCode;

  const updateResult = update({ phone: phone }, user);

  if (!updateResult) return defualtFailureResponse(res);

  sendMessage(phone, `Your password reset code is ${resetCode}`);

  serverResponse(res, 202, {
    payload: null,
    message: `Reset code sent to account with phone ${
      phone.slice(0, 4) + "xxxxxx"
    }`,
  });
};

export const verifyPasswordReset = async (req: Request, res: Response) => {
  const requiredParams = ["code", "phone", "password"];
  if (!checkParams(req.body, requiredParams))
    return invalidParamsResponse(res, requiredParams);

  const { code, phone, password } = req.body;

  const user: any | null | Document = await findOne({ phone: phone });

  if (!user) return failedToFindPhoneNumberResponse(res);

  const isCodeValid = code === user.pwdResetCode;

  if (!isCodeValid) return invalidResetCodeResponse(res);

  user.password = await encryptPassword(user);
  delete user.pwdResetCode;

  const updateResult = update({ phone: phone }, user);

  if (!updateResult) return defualtFailureResponse(res);

  serverResponse(res, 202, {
    payload: null,
    message: `Password reset complete`
  });
};
