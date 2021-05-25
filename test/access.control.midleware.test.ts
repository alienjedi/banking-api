import axios from "axios";

jest.mock("axios");

let manager: any;

beforeAll(() => {
  manager = {
    _id: "60ad284951b6f3113f227548",
    isManager: true,
    phone: "0239272981",
    password: "$2b$10$KXDjJPx9QpB2/qzQvcOACuXCLeVFyn1xEIwl.8q1mWnr5mmjbdhyK",
  };

  axios.post = jest.fn().mockImplementation((params1, params2) => {
    if (!params2.isManager)
      return Promise.resolve({
        payload: false,
        message: "Account not a manager account",
      });
    return {
      payload: manager,
      message: "Manager found",
    };
  });

  axios.get = jest.fn().mockImplementation((params1, params2) => {
    if (!params2.isManager)
      return Promise.resolve({
        payload: false,
        message: "Account not a manager account",
      });
    return {
      payload: manager,
      message: "Manager found",
    };
  });
});

describe("Tests access control to manager's endpoints", () => {
  const params = {
    _id: "60ad284951b6f3113f227548",
    isManager: false,
    phone: "0239272981",
    password: "$2b$10$KXDjJPx9QpB2/qzQvcOACuXCLeVFyn1xEIwl.8q1mWnr5mmjbdhyK",
  };
  it("Should return false payload", async () => {
    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/manager/unfreeze",
      params
    );
    const queryResult2: any = await axios.get(
      "127.0.0.1:3000/v1/manager/requests",
      {
        params: params,
      }
    );

    expect(queryResult.payload).toBe(false);
    expect(queryResult2.payload).toBe(false);
  });
});
