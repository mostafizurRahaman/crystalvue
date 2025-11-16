export type Role = "user" | "admin" | "superadmin";

export type UserStatus = "active" | "blocked" | "pending";

export interface IUser {
  id: string;
  name: string;
  email: string;
  profileUrl?: string;
  role: Role;
  userStatus: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}
