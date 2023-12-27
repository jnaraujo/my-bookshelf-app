import Elysia from "elysia";
import { createUser } from "./routes/create-user";
import { loginUser } from "./routes/login-user";
import { userProfile } from "./routes/user-profile";

const app = new Elysia()
	.get("/", () => {
		return {
			hello: "world",
		};
	})
	.use(createUser)
	.use(loginUser)
	.use(userProfile);

app.listen(3000);

console.log(
	`🔥 HTTP server running at ${app.server?.hostname}:${app.server?.port}`,
);
