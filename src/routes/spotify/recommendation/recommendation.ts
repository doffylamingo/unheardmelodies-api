import { spotifyFetch } from "@/lib/spotify-web-api";
import { getAccessToken } from "@/scrapers/get-access-token";
import { getSpotifyPreviewUrl } from "@/scrapers/get-track-preview-url";
import type { ArtistResponse } from "@/types/artist";
import type { RecommendationResponse } from "@/types/recommendation";
import { Elysia, t } from "elysia";

const formatNumber = (value: number) => {
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  return value.toFixed(1) + suffixes[suffixIndex];
};

export const recommendationRouter = new Elysia().get(
  "/recommendations",
  async ({ headers, query }) => {
    const { seed_type, seed_uris, limit = 10 } = query;
    const seedParam = seed_type === "artist" ? "seed_artists" : "seed_tracks";
    const { authorization } = headers;

    const token = await getAccessToken();

    const data = await spotifyFetch<RecommendationResponse>(
      token,
      `v1/recommendations?limit=${limit}&${seedParam}=${seed_uris}`,
      "GET",
    );

    const likes = await spotifyFetch<boolean[]>(
      authorization,
      `v1/me/tracks/contains?ids=${data.tracks.map((track) => track.id).join(",")}`,
      "GET",
    );

    const artists = await spotifyFetch<ArtistResponse>(
      token,
      `v1/artists?ids=${data.tracks.map((track) => track.artists[0].id).join(",")}`,
      "GET",
    );

    const tracks = data.tracks.map(async (track, index) => {
      const previewUrl =
        track.preview_url ?? (await getSpotifyPreviewUrl(track.id));

      return {
        track: {
          id: track.id,
          name: track.name,
          duration_ms: track.duration_ms,
          preview_url: previewUrl,
        },
        artist: {
          id: track.artists[0].id,
          name: track.artists[0].name,
          genres: artists.artists[index].genres,
          followers: formatNumber(artists.artists[index].followers.total),
          image: artists.artists[index].images[0].url,
        },
        album: {
          cover: track.album.images[0].url,
          id: track.album.id,
          name: track.album.name,
          release_date: track.album.release_date,
          total_tracks: track.album.total_tracks,
          type: track.album.album_type,
        },
        liked: likes[index],
      };
    });

    const recommendations = await Promise.all(tracks);

    return { recommendations };
  },
  {
    headers: t.Object({
      authorization: t.String(),
    }),
    query: t.Object({
      limit: t.Optional(t.Number()),
      seed_type: t.String(),
      seed_uris: t.String(),
    }),
  },
);
