import jwt from "jsonwebtoken";
import type { SignOptions, Secret } from "jsonwebtoken";
// role matches Prisma Role enum values: 'user' | 'admin' | 'superadmin'
interface IUser {
  email: string;
  role: string;
}

export const createToken = (
  payload: IUser,
  secretToken: string,
  expiresIn: string | number,
): string => {
  const options = { expiresIn } as unknown as SignOptions;

  const token = jwt.sign(
    { ...payload, role: payload.role as string },
    secretToken as Secret,
    options,
  );

  return token;
};
