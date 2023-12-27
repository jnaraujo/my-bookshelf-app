import Elysia from "elysia";
import { authentication } from "./authentication";
import { z } from "zod";
import { db } from "../../db/connection";
import { books } from "../../db/schema";

const createBookSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string(),
});

export const createBook = new Elysia()
	.use(authentication)
	.post("/books", async ({ authenticate, set, body }) => {
    const { title, author, description } = createBookSchema.parse(body);

		const { isAuth, userId } = await authenticate();
		if (!isAuth || !userId) {
			set.status = 401;
			return {
				message: "You must be logged in to create a book",
			};
		}

    await db.insert(books).values({
      title,
      author,
      description,
      ownerId: userId
    });

    set.status = 200;
	});
