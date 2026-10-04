import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey(),
  firstName: varchar({ length: 20 }).notNull(),
  lastName: varchar({ length: 20 }).notNull(),
});
