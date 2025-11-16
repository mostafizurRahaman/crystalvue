import bcrypt from "bcrypt";
import { env } from "../configs/env";

export const hashPassword = async (password: string): Promise<string> => {
  const newPassword = await bcrypt.hash(
    password,
    Number(env.PASSWORD_SALT_ROUNDS),
  );
  return newPassword;
};
