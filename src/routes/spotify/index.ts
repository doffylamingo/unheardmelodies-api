import Elysia from "elysia";
import { profileRouter } from "./profile/profile";
import { playlistRouter } from "./playlist/playlist";
import { trackRouter } from "./track/track";
import { recommendationRouter } from "./recommendation/recommendation";

export const spotifyRouter = new Elysia()
  .use(profileRouter)
  .use(playlistRouter)
  .use(trackRouter)
  .use(recommendationRouter);
