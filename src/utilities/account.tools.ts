import { AccountModel } from "../models/account.model";

export const generateAccountNumber = () => {
  // 16 digits = 1,000,000,000,000,000, = 16 possible zillion account numbers
  // Format = Bank code(7 digits)|Random number(9)
  // Assumed bank code = 1007001
  const bankCode = "1007001";
  const randomNumber = Math.floor(Math.random() * 1e9);
  let accountNumber = bankCode + randomNumber;

  while (accountNumber.length !== 16)
    accountNumber = "1007001" + Math.floor(Math.random() * 1e9);

  return accountNumber;
};

export const findOne = async (searchObject: any) => {
  try {
    return await AccountModel.findOne(searchObject).exec();
  } catch (error) {
    return null;
  }
};

export const findAll = async (searchObject: any) => {
  try {
    return await AccountModel.find(searchObject).exec();
  } catch (error) {
    return null;
  }
};

export const save = async (saveObject: any) => {
  const newAccount = new AccountModel(saveObject);
  try {
    await newAccount.save();
  } catch (error) {
    return false;
  }
  return true;
};

export const update = async (searchObject: any, updateObject: any) => {
  try {
    await AccountModel.findOneAndUpdate(searchObject, updateObject, {
      upsert: true,
    }).exec();
  } catch (error) {
    console.log("err=>>", error);
    return false;
  }
  return true;
};

export const deleteOne = async (searchObject: any) => {
  try {
    await AccountModel.deleteOne(searchObject);
  } catch (error) {
    return false;
  }
  return true;
};

export const transact = async (
  senderSearchObject: any,
  recipientSearchObject: any,
  senderUpdateObject: any,
  recipientUpdateObject: any
) => {
  try {
    const session = await AccountModel.startSession();
    await session.withTransaction(async () => {
      await update(senderSearchObject, senderUpdateObject);
      await update(recipientSearchObject, recipientUpdateObject);
    });
    session.endSession();
  } catch (error) {
    return false;
  }
  return true;
};
