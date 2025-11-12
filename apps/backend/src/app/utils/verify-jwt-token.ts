import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyJwtToken = (
  token: string,
  secretToken: string,
): JwtPayload => {
  return jwt.verify(token, secretToken) as JwtPayload;
};
