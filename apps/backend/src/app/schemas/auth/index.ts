import { signupSchema } from "./sign-up";

export * from "./sign-up";
export * from "./get-access-token";

export const loginSchema = signupSchema.pick({
  email: true,
  password: true,
});
