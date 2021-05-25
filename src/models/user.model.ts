import mongoose from "mongoose";

import { User } from "../interfaces/user.interface";
import { encryptPassword } from "../utilities/bcrypt.hash";

const UserSchema = new mongoose.Schema<User>({
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  isManager: {
    type: Boolean,
    required: true,
    default: false,
  },
  pwdResetCode: {
    type: String,
    required: false,
  },
});

UserSchema.pre("save", async function (next: any) {
  const thisUser: any = this;
  thisUser.password = await encryptPassword(thisUser);
  next();
});

export const UserModel = mongoose.model<User>("User", UserSchema);
