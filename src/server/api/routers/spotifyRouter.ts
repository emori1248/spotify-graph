import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const spotifyRouter = createTRPCRouter({
  hello: publicProcedure
    .query(async ({ ctx }) => {

      const items = await ctx.spotify.search("Guilt Trip", ["artist"]);
      
      const artist = items.artists?.items[0]!;

      const data = {
        name: artist.name,
        genres: artist.genres.join(", "),
        imageUrl: artist.images[0]?.url ?? "",
        imageWidth: artist.images[0]?.width ?? 0,
        imageHeight: artist.images[0]?.height ?? 0,
      }

      return {
        ...data,
      };
    }),
});
