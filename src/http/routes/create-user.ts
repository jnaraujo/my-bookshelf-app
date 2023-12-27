import Elysia from "elysia";
import { z } from "zod";
import { db } from "../../db/connection";
import { users } from "../../db/schema";
import { hashPassword } from "../libs/secure";

const createUserBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
});

export const createUser = new Elysia().post(
	"/users",
	async ({ body, set }) => {
		const { name, email, password } = createUserBodySchema.parse(body);

		await db.insert(users).values({
			email,
			name,
			password: hashPassword(password),
		});

		set.status = 201;
	},
);
