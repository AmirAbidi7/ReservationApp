export enum userRole {
  NORMAL = "regular",
  ORGANIZER = "organizer",
  ADMIN = "admin",
}

export type UserCreateRequest = {
  id: string;
  firstName: string;
  lastName: string;
  role: userRole;
};
