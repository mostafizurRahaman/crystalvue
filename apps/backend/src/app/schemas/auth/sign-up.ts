import { z } from "zod";

export const signupSchema = z.object({
  name: z.string({
    message: "Name is required",
  }),
  email: z
    .string({
      message: "Email is required",
    })
    .email("Invalid email format"),
  profileUrl: z
    .string({
      message: "Profile URL is required",
    })
    .url("Invalid profile URL")
    .optional(),
  password: z.string({
    message: "Password is required",
  }),
});
