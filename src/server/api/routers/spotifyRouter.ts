import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const spotifyRouter = createTRPCRouter({
    searchArtists: publicProcedure
    .input(z.object({ input: z.string() }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.spotify.search(input.input, ["artist"]);
      
      const artists = items.artists?.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        images: artist.images,
        followers: artist.followers,
      })) || [];

      return artists;
    }
  ),
  searchAlbums: publicProcedure
  .input(z.object({ input: z.string() }))
  .query(async ({ ctx, input }) => {
    const items = await ctx.spotify.search(input.input, ["album"]);
    
    const albums = items.albums?.items.map(album => ({
      id: album.id,
      name: album.name,
      artists: album.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
      })),
      images: album.images,
    })) || [];

    return albums;
  }
),
});
