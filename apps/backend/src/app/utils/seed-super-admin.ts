import { User } from "@prisma/client";
import { db } from "../db";
import AppError from "../classes/AppError";
import { hashPassword } from "./hash-pasword";
import { env } from "../configs/env";

export const seedSuperAdmin = async () => {
  //   superAdminPayload:
  const payload = {
    name: "Glass Work",
    email: "glasswork250@gmail.com",

    userStatus: "active",
    role: "superadmin",
    profileUrl: "",
  } as User;

  //  check is user Already Exists with this super admin email:
  const isUserExists = await db.user.findFirst({
    where: {
      email: payload.email,
      role: payload.role,
    },
  });

  if (isUserExists) {
    console.log("Already have a superadmin!");
    return;
  } else {
    // get super admin password:
    const superAdminPassword = env.SUPER_ADMIN_PASSWORD;

    const hashedPassword = await hashPassword(superAdminPassword);
    const user = await db.user.create({
      data: {
        ...payload,
        password: hashedPassword,
      },
    });

    if (user?.name) {
      console.log(`Super Admin created successfully!`);
      return;
    }
  }
};
