import { Response } from "express";

interface ServerResponseData {
  payload: object | null;
  message: string;
}

export const serverResponse = (
  res: Response,
  status: number,
  data: ServerResponseData
) => {
  return res.status(status).send(data);
};

export const invalidTokenResponse = (res: Response) => {
  return serverResponse(res, 401, {
    payload: null,
    message: "Invalid authentication token",
  });
};

export const failedToFindPhoneNumberResponse = (res: Response) => {
  return serverResponse(res, 404, {
    payload: null,
    message: "User with such phone number not registered",
  });
};

export const failedPasswordValidationResponse = (res: Response) => {
  return serverResponse(res, 404, {
    payload: null,
    message: "Invalid password and phone number combination",
  });
};

export const insufficientAccountBalanceResponse = (res: Response) => {
  return serverResponse(res, 400, {
    payload: null,
    message: "Not enough funds to perform transaction",
  });
};

export const failedToFindAccountResponse = (res: Response) => {
  return serverResponse(res, 404, {
    payload: null,
    message: "Invalid account number",
  });
};

export const frozenAccountResponse = (res: Response) => {
  return serverResponse(res, 404, {
    payload: null,
    message: "Can't perform transaction. Account is frozen",
  });
};

export const defualtFailureResponse = (res: Response) => {
  return serverResponse(res, 501, {
    payload: null,
    message: "Internal Server error.",
  });
};

export const insufficientAccessRightsResponse = (res: Response) => {
  return serverResponse(res, 401, {
    payload: null,
    message: "Account not a manager account",
  });
};

export const invalidParamsResponse = (res: Response, data: any) => {
  let dataObject: any = {};
  data.map((item: any) => {
    return (dataObject[item] = "undefined");
  });
  return serverResponse(res, 400, {
    payload: dataObject,
    message: "Invalid request parameters. Check payload for required params",
  });
};

export const invalidResetCodeResponse = (res: Response) => {
  return serverResponse(res, 400, {
    payload: null,
    message: "Invalid password reset code",
  });
};

export const inactiveAccountResponse = (res: Response) => {
  return serverResponse(res, 400, {
    payload: null,
    message: "Account is inactive",
  });
};

export const userAlreadyExistsResponse = (res: Response) => {
  return serverResponse(res, 400, {
    payload: null,
    message: "User already exists",
  });
};
