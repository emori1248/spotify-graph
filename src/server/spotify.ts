import { SpotifyApi } from "@spotify/web-api-ts-sdk";

import { env } from "~/env";

const createSpotifyClient = () =>
  SpotifyApi.withClientCredentials(
    process.env.SPOTIFY_CLIENT_ID!,
    process.env.SPOTIFY_CLIENT_SECRET!,
  );

const globalForSpotify = globalThis as unknown as {
  spotify: ReturnType<typeof createSpotifyClient> | undefined;
};

export const spotify = globalForSpotify.spotify ?? createSpotifyClient();

if (env.NODE_ENV !== "production") globalForSpotify.spotify = spotify;
