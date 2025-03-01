import type { TokenResponse } from "@/types/auth";
import { Elysia, t } from "elysia";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const SPOTIFY_CALLBACK = "unheardmelodies://";

export const authRouter = new Elysia({ prefix: "/auth" })
  .get(
    "/swap",
    async ({ body }) => {
      const { code } = body;

      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: SPOTIFY_CALLBACK,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET,
            ).toString("base64"),
        },
      });

      const data = (await res.json()) as TokenResponse;

      if (data.access_token) {
        return data;
      }
    },
    {
      body: t.Object({
        code: t.String(),
      }),
    },
  )
  .get(
    "/refresh",
    async ({ body }) => {
      const { refresh_token } = body;

      if (!refresh_token) throw new Error("No refresh token!");

      const res = await fetch("https://accounts.spotify.com/api/token", {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET,
            ).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token,
        }),
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = (await res.json()) as TokenResponse;

      return data;
    },
    {
      body: t.Object({
        refresh_token: t.String(),
      }),
    },
  );
