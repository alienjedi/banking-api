import jsonwebtoken from "jsonwebtoken";

export const generateToken = (data: string) => {
  return jsonwebtoken.sign(
    {
      data: data,
    },
    "secret",
    { expiresIn: 60 * 60 * 24 }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jsonwebtoken.verify(token, "secret");
  } catch (error) {
    return false;
  }
};
