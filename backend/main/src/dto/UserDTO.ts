import { userRole } from "../model/user";

export type CreateUserRequest = {
  id: string;
  firstName: string;
  lastName: string;
  role: userRole;
};

export type UserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: userRole;
};
