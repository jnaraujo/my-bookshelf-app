import Elysia from "elysia";
import cookie from '@elysiajs/cookie'
import { db } from "../../db/connection";
import { sessions } from "../../db/schema/auth";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

const TWO_HOURS = 1000 * 60 * 60 * 2;

export const authentication = new Elysia()
  .use(cookie())
  .derive(({ cookie, setCookie, removeCookie }) => {
    return {
      signIn: async (userId: string) => {
        const sessionToken = createId();
        setCookie("sessionToken", sessionToken);
        await db.insert(sessions).values({
          sessionToken,
          userId,
          expires: new Date(Date.now() + TWO_HOURS),
        });
      },
      signOut: async () => {
        const sessionToken = cookie.sessionToken;
        if (sessionToken) {
          await db.delete(sessions).where(
            eq(sessions.sessionToken, sessionToken)
          );
          removeCookie("sessionToken");
        }
      },

      authenticate: async () => {   
        const sessionToken = cookie.sessionToken;
        if (!sessionToken) {
          return {
            isAuth: false,
            userId: null,
          };
        }
        
        const result = await db.select({
          userId: sessions.userId,
          expires: sessions.expires,
        }).from(sessions).where(eq(sessions.sessionToken, sessionToken)).limit(1);

        if(result.length === 0) {
          return {
            isAuth: false,
            userId: null,
          };
        }

        const session = result[0];

        if(session.expires < new Date()) {
          await db.delete(sessions).where(
            eq(sessions.sessionToken, sessionToken)
          );
          removeCookie("sessionToken");
          return {
            isAuth: false,
            userId: null,
          };
        }

        return {
          isAuth: true,
          userId: result[0]?.userId ?? null,
        }
      }
    }
  })