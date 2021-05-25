import bcrypt from "bcrypt";
import { User } from "../interfaces/user.interface";

export const encryptPassword = async (user: User) => {
  return await bcrypt.hash(user?.password, user?.phone.length);
};

export const verifyPassword = async (inputPassword: string, userPassword: string) => {
  return await bcrypt.compare(inputPassword, userPassword);
}