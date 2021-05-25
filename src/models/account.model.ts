import mongoose from "mongoose";

import { Account } from "../interfaces/account.interface";

const AccountSchema = new mongoose.Schema<Account>({
  accountNumber: {
    type: String,
    required: true,
  },
  accountBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  accountBaseBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  accountType: {
    type: String,
    enum: ["SALARY", "SAVINGS", "CURRENT", "FIXED"],
    required: true,
  },
  accountHolderId: {
    type: String,
    required: true,
  },
  accountActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  accountPendingClose: {
    type: Boolean,
    required: true,
    default: false,
  },
  accountFrozen: {
      type: Boolean,
      required: true,
      default: false
  }
});

export const AccountModel = mongoose.model("Account", AccountSchema);
