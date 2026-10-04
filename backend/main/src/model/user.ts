import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../helper/pgToEnum";

export enum userRole {
  NORMAL = "regular",
  ORGANIZER = "organizer",
  ADMIN = "admin",
}

export const roleEnum = enumToPgEnum(userRole);

export const role = pgEnum("role", roleEnum);

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().unique(),
  firstName: varchar({ length: 20 }).notNull(),
  lastName: varchar({ length: 20 }).notNull(),
  role: role("role").notNull(),
});
