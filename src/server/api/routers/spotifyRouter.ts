import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const spotifyRouter = createTRPCRouter({
  searchArtists: publicProcedure
    .input(z.object({ input: z.string() }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.spotify.search(input.input, ["artist"]);

      const artists =
        items.artists?.items.map((artist) => ({
          id: artist.id,
          name: artist.name,
          genres: artist.genres,
          images: artist.images,
          followers: artist.followers,
        })) || [];

      return artists;
    }),
  searchAlbums: publicProcedure
    .input(z.object({ input: z.string() }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.spotify.search(input.input, ["album"]);

      const albums =
        items.albums?.items.map((album) => ({
          id: album.id,
          name: album.name,
          artists: album.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
          })),
          images: album.images,
          genres: ["test genre"],
        })) || [];

      return albums;
    }),
  createFavorite: privateProcedure
    .input(
      z.object({ albumId: z.string().min(1), albumTitle: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) throw new Error("Not authenticated");

      const album = ctx.spotify.albums.get(input.albumId);
      if (!album) throw new Error("Album not found");

      return ctx.db.favoriteAlbum.create({
        data: {
          ...input,
          userId,
        },
      });
    }),
  getFavorites: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.auth;
    if (!userId) throw new Error("Not authenticated");

    return ctx.db.favoriteAlbum.findMany({
      where: { userId },
    });
  }),

  getFavoritesFull: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.auth;
    if (!userId) throw new Error("Not authenticated");

    const favorites = await ctx.db.favoriteAlbum.findMany({
      where: { userId },
      select: { albumId: true },
    });

    return ctx.spotify.albums
      .get(favorites.map((f) => f.albumId))
      .then((albums) => {
        return albums.map((album) => ({
          ...album,
          genres: ["test genre"],
        }));
      });
  }),
});
