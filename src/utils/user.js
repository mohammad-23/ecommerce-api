import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  if (password.length < 8) {
    throw new Error("Password must be 8 characters or longer.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
};
