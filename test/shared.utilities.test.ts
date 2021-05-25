import { checkParams } from "../src/utilities/params.checkers";

let requiredParams: Array<string> = ["accountType", "accountHolderPhone"];

describe("Tests shared utility functions", () => {
    
  it("Should return false because all required parameters are not provided", () => {
    const providedRequestObject = { accountType: "SAVINGS" };
    expect(checkParams(providedRequestObject, requiredParams)).toBe(false);
  });

  it("Should return true because all required parameters are provided", () => {
    const providedRequestObject = {
      accountType: "SAVINGS",
      accountHolderPhone: "0540195142",
    };
    expect(checkParams(providedRequestObject, requiredParams)).toBe(true);
  });
});
