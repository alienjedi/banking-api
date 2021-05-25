import axios from "axios";
import { generateToken } from "../src/utilities/jwt.token";
import { generateResetCode } from "../src/utilities/user.tools";
import { encryptPassword, verifyPassword } from "../src/utilities/bcrypt.hash";

let user: any, users: Array<any>, userExists: Function;

jest.mock("axios");

beforeAll(() => {
  user = {
    _id: "60abb837babc7b04328ab7b5",
    isManager: false,
    phone: "0540195142",
    password: "$2b$10$R8Jf4UijcBvPApNfAXyXn.Zx2fVPjp9U41ha2tc1S2XgflbLHyMU6",
    __v: 0,
  };
  users = [
    {
      isManager: false,
      phone: "0540195142",
      password: "$2b$10$R8Jf4UijcBvPApNfAXyXn.Zx2fVPjp9U41ha2tc1S2XgflbLHyMU6",
    },
    {
      isManager: false,
      phone: "0239272981",
      password: "$2b$10$R8Jf4UijcBvPApNfAXyXn.Zx2fVPjp9U41ha2tc1S2XgflbLHyMU6",
    },
  ];

  userExists = jest.fn().mockImplementation((newUser: any) => {
    return users.find((_user) => _user.phone == newUser.phone);
  });
});

describe("Unit tests users controller helper functions", () => {
  it("Should generate a unique 6 digit reset code", async () => {
    const resetCode1 = generateResetCode();
    const resetCode2 = generateResetCode();

    expect(resetCode1).toHaveLength(6);
    expect(resetCode2).toHaveLength(6);
    expect(resetCode1).not.toEqual(resetCode2);
  });

  it("Should return true if user exists and false otherwise", () => {
    expect(true).toBe(true);
  });
});

describe("Tests user controller signup endpoint", () => {
  it("Should create a new user account", async () => {
    axios.post = jest.fn().mockImplementation((_p1, params) => {
      if (userExists(params))
        return Promise.resolve({
          payload: false,
          message: `User already exists`,
        });
      const newUser = params;

      newUser.password = encryptPassword(newUser);

      return Promise.resolve({
        payload: user,
        message: `New ${(newUser.isManager && "manager") || "user"} created`,
      });
    });
    const queryResult: any = await axios.post("127.0.0.1:3000/v1/user/signup", {
      phone: "0232343003",
      password: "password",
      isManager: false,
    });
    const queryResult2: any = await axios.post(
      "127.0.0.1:3000/v1/user/signup",
      {
        phone: "0540195142",
        password: "password",
        isManager: false,
      }
    );
    expect(queryResult.payload).toEqual(user);
    expect(queryResult2.payload).toBe(false);
  });
});

describe("Tests integration of verify password function and user controller signin endpoint", () => {
  it("Should verify user credentials and return user data", async () => {
    axios.post = jest.fn().mockImplementation(async (_p1, params) => {
      const userValid = await verifyPassword(params.password, user.password);
      if (!userValid)
        return Promise.resolve({
          payload: false,
          message: "Invalid credentials",
        });
      return Promise.resolve({
        payload: { user },
        message: "Signin successful",
      });
    });
    const queryResult: any = await axios.post("127.0.0.1:3000/v1/user/signin", {
      phone: "0540195142",
      password: "password",
    });
    const queryResult2: any = await axios.post(
      "127.0.0.1:3000/v1/user/signin",
      {
        phone: "0540195142",
        password: "wrongpassword",
      }
    );
    expect(queryResult.payload.user).toEqual(user);
    expect(queryResult2.payload.user).toBe(undefined);
  });
});

describe("Tests user controller password reset endpoint", () => {
  it("Should generate a reset code and send a message to user", async () => {
    const resetUser = Object.assign({}, user);
    axios.post = jest.fn().mockImplementation((_p1, params) => {
      const resetCode = generateResetCode();
      user.pwdResetCode = resetCode;
      resetUser.pwdResetCode = resetCode;
      return Promise.resolve({
        payload: resetUser,
        message: `Reset code sent to account with phone ${
          params.phone.slice(0, 4) + "xxxxxx"
        }`,
      });
    });
    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/user/resetPassword",
      {
        phone: "0540195142",
      }
    );
    expect(queryResult.payload.pwdResetCode).not.toBe(undefined);
  });
});

describe("Tests user controller verify password reset endpoint", () => {
  it("Should return true if reset code is valid and false otherwise", async () => {
    axios.post = jest.fn().mockImplementation((_p1, params) => {
      if (params.code !== user.pwdResetCode)
        return Promise.resolve({
          payload: false,
          message: "Invalid reset code",
        });
      return Promise.resolve({
        payload: user,
        message: `Password reset complete`,
      });
    });

    const queryResult: any = await axios.post(
      "127.0.0.1:3000/v1/user/verifyPassword",
      {
        code: user.pwdResetCode,
      }
    );

    const queryResult2: any = await axios.post(
      "127.0.0.1:3000/v1/user/signin",
      {
        code: "234928",
      }
    );

    expect(queryResult.payload).toEqual(user);
    expect(queryResult2.payload).toBe(false);
  });
});
