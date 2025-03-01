import { spotifyFetch } from "@/lib/spotify-web-api";
import { Elysia, t } from "elysia";

export const playlistRouter = new Elysia({ prefix: "/playlists" })
  .get(
    "/",
    async ({ headers, query }) => {
      const { limit = 50 } = query;
      const { authorization } = headers;

      return await spotifyFetch(
        authorization,
        `v1/me/playlists?limit=${limit}`,
        "GET",
      );
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({ limit: t.Optional(t.Number()) }),
    },
  )
  .post(
    "/add-track",
    async ({ headers, query, body }) => {
      const { playlist_id } = query;
      const { authorization } = headers;

      return await spotifyFetch(
        authorization,
        `v1/playlists/${playlist_id}/tracks`,
        "POST",
        body,
      );
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        playlist_id: t.String(),
      }),
      body: t.Object({
        position: t.Number(),
        uris: t.Array(t.String()),
      }),
    },
  )
  .get(
    "/remove-track",
    async ({ headers, query, body }) => {
      const { playlist_id } = query;
      const { authorization } = headers;

      return await spotifyFetch(
        authorization,
        `v1/playlists/${playlist_id}/tracks`,
        "DELETE",
        body,
      );
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        playlist_id: t.String(),
      }),
      body: t.Object({
        uris: t.Array(t.String()),
      }),
    },
  )
  .post(
    "/create",
    async ({ headers, query, body }) => {
      const { user_id } = query;
      const { authorization } = headers;

      return await spotifyFetch(
        authorization,
        `v1/users/${user_id}/playlists`,
        "POST",
        body,
      );
    },
    {
      headers: t.Object({
        authorization: t.String(),
      }),
      query: t.Object({
        user_id: t.String(),
      }),
      body: t.Object({
        name: t.String(),
        description: t.String(),
        public: t.Boolean(),
      }),
    },
  );
