"use client";

import { Search, Heart, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { AlbumSearch } from "./AlbumSearch";
import { FavoritesList } from "./FavoritesList";
import type { Album } from "./types";

interface AppSidebarProps {
  favorites: Album[];
  onAddToFavorites: (id: string) => void;
  onRemoveFromFavorites: (id: string) => void;
  onOpenTagDialog: (album: Album) => void;
}

export function AppSidebar({
  favorites,
  onAddToFavorites,
  onRemoveFromFavorites,
  onOpenTagDialog,
}: AppSidebarProps) {
  return (
    <Sidebar className="w-80">
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-lg font-semibold">Music Discovery</h2>
            <p className="text-muted-foreground text-sm">
              Build your music similarity graph
            </p>
          </div>
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Collapsible defaultOpen>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search Albums
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <AlbumSearch
                  onAddToFavorites={onAddToFavorites}
                  favorites={favorites}
                />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favorites ({favorites.length})
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <FavoritesList
                  favorites={favorites}
                  onRemoveFromFavorites={onRemoveFromFavorites}
                  onOpenTagDialog={onOpenTagDialog}
                />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
}
