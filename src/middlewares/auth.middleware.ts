import { Request, Response } from "express";

import { findOne } from "../utilities/user.tools";
import { verifyToken } from "../utilities/jwt.token";
import { invalidTokenResponse, defualtFailureResponse } from "../utilities/server.response";

export const authMiddleware = async (req: Request, res: Response, next: Function) => {
  const token: string | undefined = req
    .header("Authorization")
    ?.replace(/^Bearer\s/, "");

  if (!token) return invalidTokenResponse(res);

  const valid: any = verifyToken(token);

  if (!valid) return invalidTokenResponse(res);

  const user: any | null | Document = await findOne({phone: valid.data});

  // User must exist at this point.
  // Return internal server error if user not found
  if (!user) return defualtFailureResponse(res);

  res.locals.user = user;

  next();
};
