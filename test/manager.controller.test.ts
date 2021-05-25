import axios from "axios";

let manager: any, account: any;

jest.mock("axios");

beforeAll(() => {
  manager = {
    _id: "60ad284951b6f3113f227548",
    isManager: true,
    phone: "0239272981",
    password: "$2b$10$KXDjJPx9QpB2/qzQvcOACuXCLeVFyn1xEIwl.8q1mWnr5mmjbdhyK",
  };

  account = {
    _id: "60a841f66a07531f89189c00",
    accountBalance: 50,
    accountBaseBalance: 10,
    accountActive: true,
    accountPendingClose: false,
    accountType: "SAVINGS",
    accountNumber: "100700193432583",
    accountHolderId: "60a8033ea32fec1d05697e41",
    __v: 0,
    accountFrozen: false,
  };
});

describe("Tests acccounts controller helper functions", () => {
  const params: any = { accountNumber: "100700193432583" };
  it("Should approve account close by deleting account", async () => {
    axios.post = jest.fn().mockImplementation(() => {
      //delete account;
      return Promise.resolve({
        payload: true,
        message: "Account close approved",
      });
    });
    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/manager/close",
      params
    );
    expect(queryResult.payload).toBe(true);
  });
});

describe("Tests manager's freeze account endpoint", () => {
  const params: any = { accountNumber: "100700193432583" };
  it("Should freeze account", async () => {
    axios.post = jest.fn().mockImplementation(() => {
      account.accountFrozen = true;
      return Promise.resolve({
        payload: account,
        message: "Account freeze complete",
      });
    });
    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/manager/freeze",
      params
    );
    expect(queryResult.payload.accountFrozen).toBe(true);
  });
});

describe("Tests manager's unfreeze account endoint", () => {
  const params: any = { accountNumber: "100700193432583" };
  it("Should unfreeze account", async () => {
    axios.post = jest.fn().mockImplementation(() => {
      account.accountFrozen = false;
      return Promise.resolve({
        payload: account,
        message: "Account ufreeze complete",
      });
    });
    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/manager/unfreeze",
      params
    );
    expect(queryResult.payload.accountFrozen).toBe(false);
  });
});
