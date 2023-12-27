import Elysia from "elysia";
import { createUser } from "./routes/create-user";
import { loginUser } from "./routes/login-user";
import { userProfile } from "./routes/user-profile";
import { createBook } from "./routes/create-book";
import { myBooks } from "./routes/my-books";

const app = new Elysia()
	.get("/", () => {
		return {
			hello: "world",
		};
	})
	.use(createUser)
	.use(loginUser)
	.use(userProfile)
	.use(createBook)
	.use(myBooks)

app.listen(3000);

console.log(
	`🔥 HTTP server running at ${app.server?.hostname}:${app.server?.port}`,
);
