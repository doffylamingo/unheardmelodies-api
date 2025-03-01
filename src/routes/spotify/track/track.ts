import { spotifyFetch } from "@/lib/spotify-web-api";
import { Elysia, t } from "elysia";

export const trackRouter = new Elysia({ prefix: "/tracks" })
  .get(
    "/",
    async ({ headers, query }) => {
      const { limit = 10, offset = 0 } = query;
      const { authorization } = headers;

      return await spotifyFetch(
        authorization,
        `v1/me/tracks?limit=${limit}&offset=${offset}`,
        "GET",
      );
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Cookie({
        limit: t.Optional(t.Number()),
        offset: t.Optional(t.Number()),
      }),
    },
  )
  .get(
    "/like",
    async ({ headers, query }) => {
      const { authorization } = headers;

      return await spotifyFetch(authorization, `v1/me/tracks`, "PUT", {
        ids: [query.id],
      });
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        id: t.String(),
      }),
    },
  )
  .get(
    "/unlike",
    async ({ cookie, query }) => {
      const token = cookie.access_token.value;

      return await spotifyFetch(token, `v1/me/tracks`, "DELETE", {
        ids: [query.id],
      });
    },
    {
      cookie: t.Cookie({
        access_token: t.String(),
      }),
      query: t.Object({
        id: t.String(),
      }),
    },
  );
