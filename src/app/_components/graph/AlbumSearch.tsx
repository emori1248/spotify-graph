"use client";

import { useState } from "react";
import { Search, Plus, Heart } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { mockAlbums } from "./mock-data";
import type { Album } from "./types";

interface AlbumSearchProps {
  onAddToFavorites: (album: Album) => void;
  favorites: Album[];
}

export function AlbumSearch({ onAddToFavorites, favorites }: AlbumSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Album[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Mock search - filter albums by name or artist
    const results = mockAlbums.filter(
      (album) =>
        album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResults(results);
  };

  const isInFavorites = (albumId: string) => {
    return favorites.some((fav) => fav.id === albumId);
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
        {searchResults.map((album) => (
          <Card key={album.id} className="p-2">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <img
                  src={album.image || "/placeholder.svg"}
                  alt={album.name}
                  className="h-12 w-12 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{album.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {album.artist}
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
                  onClick={() => onAddToFavorites(album)}
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
