import { Elysia } from "elysia";
import authController from "./controllers/auth.controller";
import cardController from "./controllers/card.controller";
const port = process.env.PORT || 3001;
const app = new Elysia({ prefix: "/api" })
  .use(authController)
  .use(cardController)
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
