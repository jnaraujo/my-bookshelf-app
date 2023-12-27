import Elysia from "elysia";
import { authentication } from "./authentication";
import { db } from "../../db/connection";
import { books } from "../../db/schema";
import { eq } from "drizzle-orm";

export const myBooks = new Elysia()
  .use(authentication)
  .get("/my-books", async ({ set, authenticate, cookie }) => {
    const { isAuth, userId } = await authenticate();
    if (!isAuth || !userId) {
      set.status = 401;
      return;
    }

    const userBooks = await db.select({
      title: books.title,
      author: books.author,
      description: books.description,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
    }).from(books).where(eq(books.ownerId, userId));

    return userBooks;
  });