import Elysia from "elysia";
import { z } from "zod";
import { db } from "../../db/connection";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { isPasswordValid } from "../libs/secure";
import { authentication } from "./authentication";

const loginUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginUser = new Elysia()
  .use(authentication)
  .post("/login", async ({body, set, signIn}) => {
    const { email, password } = loginUserBodySchema.parse(body);

    const result = await db.select({
      password: users.password,
      id: users.id,
    }).from(users).where(eq(users.email, email)).limit(1)

    if(result.length === 0) {
      set.status = 401;
      return;
    }

    const user = result[0];

    if(!isPasswordValid(password, user.password)) {
      set.status = 401;
      return;
    }

    await signIn(user.id);

    set.status = 200;
  })