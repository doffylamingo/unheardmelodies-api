import { Elysia } from "elysia";
import { authRouter } from "./routes/auth";
import { spotifyRouter } from "./routes/spotify";

export const api = new Elysia({
  prefix: "/api",
})
  .get("/", () => "Unheard Melodies API")
  .use(authRouter)
  .use(spotifyRouter);
