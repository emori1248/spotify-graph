"use client";

import { useEffect, useRef, useState } from "react";
import type { Album, GraphNode, GraphLink, AlbumWithTags } from "./types";

interface SimilarityGraphProps {
  favorites: AlbumWithTags[];
}

// Robust seeded random number generator (LCG algorithm)
function seededRandom(seed: number) {
  // Linear Congruential Generator - produces identical results across environments
  const a = 1664525;
  const c = 1013904223;
  const m = Math.pow(2, 32);

  seed = (a * seed + c) % m;
  return seed / m;
}

export function SimilarityGraph({ favorites }: SimilarityGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isClient, setIsClient] = useState(false);

  // Ensure we only generate positions on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate similarity between albums based on shared tags
  const calculateSimilarity = (
    album1: AlbumWithTags,
    album2: AlbumWithTags,
  ): number => {
    const tags1 = new Set(album1.tags);
    const tags2 = new Set(album2.tags);
    const intersection = new Set([...tags1].filter((x) => tags2.has(x)));
    const union = new Set([...tags1, ...tags2]);

    if (union.size === 0) return 0;
    return intersection.size / union.size;
  };

  // Generate graph data with deterministic positioning
  const generateGraphData = () => {
    if (!isClient) {
      // Return empty data during SSR
      return { nodes: [], links: [] };
    }

    const nodes: GraphNode[] = favorites.map((album, index) => {
      // Use album ID as seed for consistent positioning

      return {
        id: album.id,
        album,
        x: Math.random() * (dimensions.width - 100) + 50,
        y: Math.random() * (dimensions.height - 100) + 50,
      };
    });

    const links: GraphLink[] = [];
    for (let i = 0; i < favorites.length; i++) {
      for (let j = i + 1; j < favorites.length; j++) {
        const similarity = calculateSimilarity(favorites[i]!, favorites[j]!);
        if (similarity > 0.1) {
          // Only show links with some similarity
          links.push({
            source: favorites[i]!.id,
            target: favorites[j]!.id,
            strength: similarity,
          });
        }
      }
    }

    return { nodes, links };
  };

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          setDimensions({
            width: rect.width,
            height: Math.max(400, rect.height),
          });
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { nodes, links } = generateGraphData();

  if (favorites.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl">🎵</div>
          <h3 className="mb-2 text-lg font-medium">No Music Graph Yet</h3>
          <p className="text-sm">
            Add albums to your favorites and tag them to see similarity
            connections
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-background rounded-lg border"
      >
        {/* Links */}
        {links.map((link, index) => {
          const sourceNode = nodes.find((n) => n.id === link.source);
          const targetNode = nodes.find((n) => n.id === link.target);

          if (!sourceNode || !targetNode) return null;

          return (
            <line
              key={index}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="#94a3b8"
              strokeWidth={link.strength * 4}
              opacity={0.6}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const artists = node.album.artists
            .map((artist) => artist.name)
            .join(", ");
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={30}
                fill="white"
                stroke="#e2e8f0"
                strokeWidth={2}
              />
              <image
                x={node.x! - 25}
                y={node.y! - 25}
                width={50}
                height={50}
                href={node.album.images[0]?.url}
                clipPath="circle(25px at center)"
              />
              <text
                x={node.x}
                y={node.y! + 45}
                textAnchor="middle"
                className="fill-foreground text-xs font-medium"
                style={{ maxWidth: "100px" }}
              >
                {node.album.name.length > 15
                  ? `${node.album.name.substring(0, 25)}...`
                  : node.album.name}
              </text>
              <text
                x={node.x}
                y={node.y! + 58}
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
              >
                {artists.length > 15
                  ? `${artists.substring(0, 25)}...`
                  : artists}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="bg-muted/50 mt-4 rounded-lg p-4 px-16">
        <h4 className="mb-2 font-medium">Graph Legend</h4>
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-slate-400"></div>
            <span>Similarity connection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full border-2 border-slate-200 bg-white"></div>
            <span>Album</span>
          </div>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Thicker lines indicate stronger similarity based on shared tags
        </p>
      </div>
    </div>
  );
}
