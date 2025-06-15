"use client";

import { Heart, Tag, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { Album } from "./types";

interface FavoritesListProps {
  favorites: Album[];
  onRemoveFromFavorites: (albumId: string) => void;
  onOpenTagDialog: (album: Album) => void;
}

export function FavoritesList({
  favorites,
  onRemoveFromFavorites,
  onOpenTagDialog,
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <Heart className="mx-auto mb-2 h-8 w-8 opacity-50" />
        <p className="text-sm">No favorites yet</p>
        <p className="text-xs">Search and add albums to get started</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 space-y-2 overflow-y-auto">
      {favorites.map((album) => (
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
                <div className="mt-1 flex flex-wrap gap-1">
                  {album.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {album.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{album.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onOpenTagDialog(album)}
                  className="h-6 w-6"
                >
                  <Tag className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onRemoveFromFavorites(album.id)}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
