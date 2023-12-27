import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { db } from "../../db/connection";
import { users } from "../../db/schema";
import { authentication } from "./authentication";

export const userProfile = new Elysia()
	.use(authentication)
	.get("/profile", async ({ set, authenticate, cookie }) => {
		const { isAuth, userId } = await authenticate();
		if (!isAuth || !userId) {
			set.status = 401;
			return;
		}

		const response = await db
			.select({
				email: users.email,
				name: users.name,
			})
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);
		const user = response[0];

		return user;
	});
