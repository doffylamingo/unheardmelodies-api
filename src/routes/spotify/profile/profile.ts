import { Elysia, t } from "elysia";
import { spotifyFetch } from "@/lib/spotify-web-api";

export const profileRouter = new Elysia({ prefix: "/profile" })
  .get(
    "/",
    async ({ headers }) => {
      const { authorization } = headers;

      return await spotifyFetch(authorization, "v1/me", "GET");
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
    },
  )
  .get(
    "/top-tracks",
    async ({ headers, query }) => {
      const { limit = 5 } = query;
      const { authorization } = headers;

      return await spotifyFetch(
        authorization,
        `v1/me/top/tracks?time_range=long_term&limit=${limit}`,
        "GET",
      );
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        limit: t.Optional(t.Number()),
      }),
    },
  );
