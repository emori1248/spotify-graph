"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function SpotifyAlbumSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [favoriteAlbums] = api.spotify.getFavorites.useSuspenseQuery();
  const favoriteAlbumIds = favoriteAlbums.map((album) => album.albumId);

  const utils = api.useUtils();

  const addFavorite = api.spotify.createFavorite.useMutation({
    onSuccess: async () => {
      await utils.spotify.invalidate();
    },
  });

  // tRPC query - only runs when submittedQuery changes
  const {
    data: albums,
    isLoading,
    error,
  } = api.spotify.searchAlbums.useQuery(
    { input: submittedQuery },
    {
      enabled: !!submittedQuery, // Only run query when we have a submitted query
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an album..."
            // className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
          />
          <button
            type="submit"
            disabled={!searchQuery.trim() || isLoading}
            // className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && <div className="mb-4 text-red-600">Error: {error.message}</div>}

      {albums && albums.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Results for "{submittedQuery}":
          </h2>
          {albums.map((album) => (
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
                onClick={(e) => {
                  e.preventDefault();
                  addFavorite.mutate({
                    albumId: album.id,
                    albumTitle: album.name,
                  });
                }}
              >
                {favoriteAlbumIds.includes(album.id) ? "❤️" : "+"}
              </button>
            </div>
          ))}
        </div>
      )}

      {albums && albums.length === 0 && submittedQuery && (
        <div className="text-gray-600">
          No albums found for "{submittedQuery}"
        </div>
      )}
    </div>
  );
}
