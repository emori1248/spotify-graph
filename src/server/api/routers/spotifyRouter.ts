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
        })) ?? [];

      return artists;
    }),
  searchAlbums: publicProcedure
    .input(z.object({ input: z.string() }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.spotify.search(input.input, ["album"]);

      const artistIds = new Set(
        items.albums?.items
          .map((album) => album.artists.map((a) => a.id))
          .flat(),
      );
      const artists = await ctx.spotify.artists.get(Array.from(artistIds));

      return items.albums?.items.map((album) => ({
        ...album,
        genres: artists
          .find((a) => album.artists.some((aa) => aa.id === a.id))
          ?.genres.map((str) =>
            str
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
              )
              .join(" "),
          ) ?? ["Unknown Genre"],
      }));
    }),
  createFavorite: privateProcedure
    .input(z.object({ albumId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) throw new Error("Not authenticated");

      const album = await ctx.spotify.albums.get(input.albumId);
      if (!album) throw new Error("Album not found");

      return ctx.db.favoriteAlbum.create({
        data: {
          albumId: album.id,
          albumTitle: album.name,
          userId,
        },
      });
    }),
  removeFavorite: privateProcedure
    .input(z.object({ albumId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx.auth;
      if (!userId) throw new Error("Not authenticated");

      const album = await ctx.db.favoriteAlbum.findFirst({
        where: {
          albumId: input.albumId,
          userId,
        },
      });
      if (!album) throw new Error("Album not found");

      return ctx.db.favoriteAlbum.delete({
        where: {
          albumId: input.albumId,
          userId,
        },
      });
    }),
  // getFavorites: privateProcedure.query(async ({ ctx }) => {
  //   const { userId } = ctx.auth;
  //   if (!userId) throw new Error("Not authenticated");

  //   return ctx.db.favoriteAlbum.findMany({
  //     where: { userId },
  //   });
  // }),

  getFavoritesFull: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.auth;
    if (!userId) throw new Error("Not authenticated");

    const favorites = await ctx.db.favoriteAlbum.findMany({
      where: { userId },
      select: { albumId: true },
    });

    if (favorites.length === 0) {
      return [];
    }

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
