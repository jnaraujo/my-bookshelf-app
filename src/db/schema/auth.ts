import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { createId } from "@paralleldrive/cuid2";

export const sessions = pgTable('session', {
  sessionToken: text('session_token').$defaultFn(() => createId()).primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').defaultNow().notNull(),
});