import { UserModel } from "../models/user.model";

export const generateResetCode = () => {
  let code = Math.floor(Math.random() * 1e6).toString();
  while (code.length !== 6) code = Math.floor(Math.random() * 1e6).toString();
  return code;
};

export const findOne = async (searchObject: any) => {
  try {
    return await UserModel.findOne(searchObject).exec();
  } catch (error) {
    return null;
  }
};

export const save = async (saveObject: any) => {
  const newUser = new UserModel(saveObject);
  try {
    await newUser.save();
  } catch (error) {
    return false;
  }
  return true;
};

export const update = async (searchObject: any, updateObject: any) => {
  try {
    await UserModel.findOneAndUpdate(searchObject, updateObject, {
      upsert: true,
    }).exec();
  } catch (error) {
    return false;
  }
  return true;
};

export const userExists = async (phone: string) => {
  const user = await findOne({ phone: phone });
  if (user) return true;
  return false;
};
