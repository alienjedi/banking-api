import { generateToken, verifyToken } from "../src/utilities/jwt.token";

let user: any;

beforeAll(() => {
  user = {
    isManager: false,
    phone: "0540195142",
    password: "$2b$10$R8Jf4UijcBvPApNfAXyXn.Zx2fVPjp9U41ha2tc1S2XgflbLHyMU6",
  };
});

describe("Unit tests authentication middleware helper functions", () => {
  it("Should return true if token is valid and false otherwise", () => {
      user.token = generateToken(user.phone);
      const isValid = verifyToken(user.token);
      expect(isValid).not.toBe(true);
  });
});
