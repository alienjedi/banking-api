import { Request, Response } from "express";

import { insufficientAccessRightsResponse } from "../utilities/server.response";

export const accessControlMiddleware = (
  req: Request,
  res: Response,
  next: Function
) => {
  // Get user assigned to res.locals by auth middleware
  const user = res.locals.user;

  if (!user.isManager) return insufficientAccessRightsResponse(res);

  next();
};

export default accessControlMiddleware;
