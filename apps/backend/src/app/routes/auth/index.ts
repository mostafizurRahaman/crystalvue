import express from "express";
import { createUserRoute } from "./create-user";
import { getAccessTokenRoute } from "./get-access-token";
import { validateZodSchema } from "../../middlewares";
import {
  loginSchema,
  signupSchema,
  getAccessTokenSchema,
} from "../../schemas/auth";
import { loginUserRoute } from "./login-user";

export const authRouter = express.Router();

authRouter.use(
  "/sign-up",
  validateZodSchema({ body: signupSchema }),
  createUserRoute,
);
authRouter.use(
  "/sign-in",
  validateZodSchema({ body: loginSchema }),
  loginUserRoute,
);
authRouter.use(
  "/get-access-token",
  validateZodSchema({ body: getAccessTokenSchema }),
  getAccessTokenRoute,
);
