import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const books = pgTable("books", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	title: text("title").notNull(),
	author: text("author").notNull(),
	description: text("description").notNull(),

	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),

	ownerId: text("owner_id")
		.references(() => users.id, {
			onDelete: "cascade",
		})
		.notNull(),
});
