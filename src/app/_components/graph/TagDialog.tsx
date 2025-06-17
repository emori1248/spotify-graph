"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import type { Album, Tag } from "./types";

interface TagDialogProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
  availableTags: Tag[];
  onUpdateAlbumTags: (albumId: string, tags: string[]) => void;
  onCreateTag: (tagName: string) => void;
}

export function TagDialog({
  album,
  isOpen,
  onClose,
  availableTags,
  onUpdateAlbumTags,
  onCreateTag,
}: TagDialogProps) {
  const [newTagName, setNewTagName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Update selected tags when album changes
  useEffect(() => {
    if (album) {
      setSelectedTags([]); // TODO
    }
  }, [album]);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName],
    );
  };

  const handleCreateTag = () => {
    if (
      newTagName.trim() &&
      !availableTags.some((t) => t.name === newTagName.trim())
    ) {
      onCreateTag(newTagName.trim());
      setSelectedTags((prev) => [...prev, newTagName.trim()]);
      setNewTagName("");
    }
  };

  const handleSave = () => {
    if (album) {
      onUpdateAlbumTags(album.id, selectedTags);
      onClose();
    }
  };

  if (!album) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tag Album</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={album?.images[0]?.url ?? "/placeholder.svg"}
              alt={album.name}
              className="h-12 w-12 rounded object-cover"
            />
            <div>
              <p className="font-medium">{album.name}</p>
              <p className="text-muted-foreground text-sm">
                {album.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Available Tags</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={
                    selectedTags.includes(tag.name) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag.name)}
                  style={{
                    backgroundColor: selectedTags.includes(tag.name)
                      ? tag.color
                      : undefined,
                    borderColor: tag.color,
                  }}
                >
                  {tag.name}
                  {selectedTags.includes(tag.name) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Create New Tag</Label>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
              />
              <Button onClick={handleCreateTag} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Tags</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
