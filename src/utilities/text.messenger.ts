import axios from "axios";
import dotenv from "dotenv";

export const sendMessage = async (phone: string, message: string) => {
  if (!process.env.NODE_ENV) dotenv.config();
  try {
    const sendResult = await axios.post(
      "https://sms.arkesel.com/api/v2/sms/send",
      {
        sender: "Banking-API",
        recipients: [phone],
        message: message,
      },
      {
        headers: { "api-key": process.env.API_KEY },
      }
    );
    if (sendResult.data.status === "success") return true;
    return false;
  } catch (error) {
    return false;
  }
};
