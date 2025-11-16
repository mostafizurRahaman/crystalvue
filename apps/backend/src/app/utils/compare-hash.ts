import bcrypt from "bcrypt";

export const compareHash = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const isPasswordMatched = await bcrypt.compare(password, hash);
  return isPasswordMatched;
};
