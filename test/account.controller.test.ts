import axios from "axios";
import { generateAccountNumber } from "../src/utilities/account.tools";

let account: any;

beforeAll(() => {
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

describe("Unit tests acccount controller helper functions", () => {
  it("Should generate a 16 digit unique number", () => {
    const accNum1 = generateAccountNumber();
    const accNum2 = generateAccountNumber();

    expect(accNum1).toHaveLength(16);
    expect(accNum2).toHaveLength(16);
    expect(accNum1).not.toEqual(accNum2);
  });
});

describe("Tests account controller create endpoint", () => {
  const params = {
    accountType: "SAVINGS",
    accountHolderPhone: "0540195142",
  };
  const mockAccountNumber = generateAccountNumber();
  const mockQueryResult = {
    payload: {
      accountNumber: mockAccountNumber,
    },
    message: `New account created for user with phone number ${params.accountHolderPhone}`,
  };

  axios.post = jest.fn().mockResolvedValue(Promise.resolve(mockQueryResult));

  it("Should create a new account with provided parameters", async () => {
    const queryResult = await axios.post(
      "127.0.0.1:3000/v1/account/create",
      params
    );
    expect(queryResult).toEqual(mockQueryResult);
  });
});

describe("Tests account controller deposit endpoint", () => {
  it("Should credit deposit amount to account's balance", async () => {
    const params: any = {
      accountNumber: "100700193432583",
      depositAmount: 10,
    };

    axios.post = jest.fn().mockImplementation(() => {
      const depositAccount: any = Object.assign({}, account);

      depositAccount.accountBalance += params.depositAmount;

      return Promise.resolve({
        payload: depositAccount,
        message: `${params.depositAmount} GHS deposit transaction complete`,
      });
    });

    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/account/deposit",
      params
    );

    expect(queryResult.payload.accountBalance).toEqual(
      account.accountBalance + params.depositAmount
    );
  });
});

describe("Tests account controller withdrawal endpoint", () => {
  it("Should debit withdrawal amount to account's balance", async () => {
    const params: any = {
      accountNumber: "100700193432583",
      withdrawalAmount: 10,
    };

    axios.post = jest.fn().mockImplementation(() => {
      const withdrawalAccount: any = Object.assign({}, account);

      withdrawalAccount.accountBalance -= params.withdrawalAmount;

      return Promise.resolve({
        payload: withdrawalAccount,
        message: `${params.withdrawalAmount} GHS withdrawal transaction complete`,
      });
    });

    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/account/withdraw",
      params
    );

    expect(queryResult.payload.accountBalance).toEqual(
      account.accountBalance - params.withdrawalAmount
    );
  });
});

describe("Tests account controller transfer endpoint", () => {
  it("Should debit sender account and recipient destination account", async () => {
    const params: any = {
      accountNumber: "100700193432583",
      transferAmount: 10,
    };

    axios.post = jest.fn().mockImplementation(() => {
      let senderAccount: any = Object.assign({}, account);
      let recipientAccount: any = Object.assign({}, account);

      senderAccount.accountBalance -= params.transferAmount;
      recipientAccount.accountBalance += params.transferAmount;
      return Promise.resolve({
        payload: { senderAccount, recipientAccount },
        message: `${params.transferAmount} GHS transfer transaction complete`,
      });
    });

    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/account/transfer",
      params
    );

    expect(queryResult.payload.senderAccount.accountBalance).toEqual(
      account.accountBalance - params.transferAmount
    );
    expect(queryResult.payload.recipientAccount.accountBalance).toEqual(
      account.accountBalance + params.transferAmount
    );
  });
});

describe("Tests account controller close account endpoint", () => {
  it("Should flip the accountPendingClose field to true", async () => {
    const params = {
      accountNumber: "100700193432583",
    };

    axios.post = jest.fn().mockImplementation(() => {
      const closedAccount: any = Object.assign({}, account);
      closedAccount.accountPendingClose = true;
      return Promise.resolve({
        payload: closedAccount,
        message: "Close account requested. Awaiting manager approval",
      });
    });

    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/account/transfer",
      params
    );

    expect(queryResult.payload.accountPendingClose).toBe(true);
  });
});
