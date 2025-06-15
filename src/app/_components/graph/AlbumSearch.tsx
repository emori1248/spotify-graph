"use client";

import { useState } from "react";
import { Search, Plus, Heart } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { mockAlbums } from "./mock-data";
import type { Album } from "./types";
import { api } from "~/trpc/react";

interface AlbumSearchProps {
  onAddToFavorites: (album: Album) => void;
  favorites: Album[];
}

export function AlbumSearch({ onAddToFavorites }: AlbumSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [favorites] = api.spotify.getFavorites.useSuspenseQuery();

  const utils = api.useUtils();

  const addFavorite = api.spotify.createFavorite.useMutation({
    onSuccess: async () => {
      await utils.spotify.invalidate();
    },
  });

  const {
    data: searchResults,
    isLoading,
    error,
  } = api.spotify.searchAlbums.useQuery(
    { input: submittedQuery },
    {
      enabled: !!submittedQuery, // Only run query when we have a submitted query
    },
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
    }
  };

  const isInFavorites = (albumId: string) => {
    return favorites.some((fav) => fav.albumId === albumId);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search albums or artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto">
        {isLoading && <p className="p-2">Loading...</p>}
        {searchResults?.map((album) => (
          <Card key={album.id} className="p-2">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <img
                  src={album.images[0]?.url || "/placeholder.svg"}
                  alt={album.name}
                  className="h-12 w-12 rounded object-cover"
                  width={album.images[0]?.width}
                  height={album.images[0]?.height}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{album.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {album.artists.map((artist) => artist.name).join(", ")}
                  </p>
                  <div className="mt-1 flex gap-1">
                    {album.genres.slice(0, 2).map((genre) => (
                      <Badge
                        key={genre}
                        variant="secondary"
                        className="text-xs"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant={isInFavorites(album.id) ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault();
                    addFavorite.mutate({
                      albumId: album.id,
                      albumTitle: album.name,
                    });
                  }}
                  disabled={isInFavorites(album.id)}
                >
                  {isInFavorites(album.id) ? (
                    <Heart className="h-4 w-4 fill-current" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
