"use client";

import { api } from "~/trpc/react";

export function FavoritesList() {
  const [favoriteAlbums] = api.spotify.getFavoritesFull.useSuspenseQuery();

  return (
    <>
      {favoriteAlbums && favoriteAlbums.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Favorites:</h2>
          {favoriteAlbums.map((album) => (
            <div
              key={album.id}
              className="flex h-26 items-center gap-4 rounded-3xl bg-white/10 p-4"
            >
              {album.images[0] && (
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold">{album.name}</h3>
                <p className="text-sm text-gray-300">
                  {album.artists.map((artist, index) => (
                    <span key={artist.id}>
                      {artist.name}
                      {index < album.artists.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>

              <button
                className="ml-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white transition-colors hover:bg-white/20"
                // onClick={(e) => {
                //   e.preventDefault();
                //   addFavorite.mutate({
                //     albumId: album.id,
                //     albumTitle: album.name,
                //   });
                // }}
              >
                {"❤️"}
              </button>
            </div>
          ))}
        </div>
      )}

      {favoriteAlbums && favoriteAlbums.length === 0 && (
        <div className="text-gray-600">No favorites found</div>
      )}
    </>
  );
}
