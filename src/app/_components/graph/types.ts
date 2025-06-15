export interface Album {
  id: string;
  name: string;
  artist: string;
  image: string;
  year: number;
  genres: string[];
  isFavorite: boolean;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  isCustom: boolean;
}

export interface GraphNode {
  id: string;
  album: Album;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number;
}
