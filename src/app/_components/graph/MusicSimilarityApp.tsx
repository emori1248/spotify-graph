"use client";

import { useState } from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "~/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SimilarityGraph } from "./SimilarityGraph";
import { TagDialog } from "./TagDialog";
import type { Album, Tag } from "./types";
import { UserButton } from "@clerk/nextjs";
import { api } from "~/trpc/react";

export default function MusicSimilarityApp() {
  const [favorites] = api.spotify.getFavoritesFull.useSuspenseQuery();
  const [availableTags, setAvailableTags] = useState<Tag[]>([]); // TODO
  const [selectedAlbumForTagging, setSelectedAlbumForTagging] =
    useState<Album | null>(null);

  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const utils = api.useUtils();

  const addFavorite = api.spotify.createFavorite.useMutation({
    onSuccess: async () => {
      await utils.spotify.invalidate();
    },
  });

  const removeFavorite = api.spotify.removeFavorite.useMutation({
    onSuccess: async () => {
      await utils.spotify.invalidate();
    },
  });

  const handleAddToFavorites = (id: string) => {
    addFavorite.mutate({
      albumId: id,
    });
  };

  const handleRemoveFromFavorites = (id: string) => {
    removeFavorite.mutate({
      albumId: id,
    });
  };

  const handleOpenTagDialog = (album: Album) => {
    setSelectedAlbumForTagging(album);
    setIsTagDialogOpen(true);
  };

  const handleUpdateAlbumTags = (albumId: string, tags: string[]) => {
    // TODO
    // setFavorites((prev) =>
    //   prev.map((album) => (album.id === albumId ? { ...album, tags } : album)),
    // );
  };

  const handleCreateTag = (tagName: string) => {
    const colors = [
      "#3B82F6",
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
    ];
    const newTag: Tag = {
      id: Date.now().toString(),
      name: tagName,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#3B82F6",
      isCustom: true,
    };
    setAvailableTags((prev) => [...prev, newTag]);
  };

  const testTag: Tag = {
    color: "#3B82F6",
    id: "0",
    name: "Test Tag",
    isCustom: false,
  };
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full">
        <AppSidebar
          favorites={favorites}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
          onOpenTagDialog={handleOpenTagDialog}
        />

        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 pr-8">
            <SidebarTrigger className="-ml-1" />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <h1 className="truncate pl-8 text-xl font-semibold">
                Music Similarity Graph
              </h1>
              {favorites.length > 0 && (
                <span className="text-muted-foreground text-sm whitespace-nowrap">
                  ({favorites.length} albums)
                </span>
              )}
            </div>
            <UserButton />
          </header>

          <main className="flex-1 p-4">
            {/* TODO */}
            <SimilarityGraph
              favorites={favorites.map((favorite) => {
                return { ...favorite, tags: [testTag] };
              })}
            />
          </main>
        </SidebarInset>
      </div>

      <TagDialog
        album={selectedAlbumForTagging}
        isOpen={isTagDialogOpen}
        onClose={() => {
          setIsTagDialogOpen(false);
          setSelectedAlbumForTagging(null);
        }}
        availableTags={availableTags}
        onUpdateAlbumTags={handleUpdateAlbumTags}
        onCreateTag={handleCreateTag}
      />
    </SidebarProvider>
  );
}
