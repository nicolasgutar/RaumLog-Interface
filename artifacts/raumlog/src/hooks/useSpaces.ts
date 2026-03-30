import { useState, useEffect, useCallback } from "react";
import { fetchSignedUrls } from "@/hooks/useSignedUpload";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export interface SpacesQuery {
  limit?: number;
  offset?: number;
  category?: string;
  accessType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export type SpaceDTO = any;
export type SpacesResponse = any;

/**
 * Enriches each space's `images` array by resolving GCS paths to signed read URLs.
 * Falls back to the original value (or placeholder) if resolution fails.
 */
async function resolveSpaceImages(spaces: SpaceDTO[]): Promise<SpaceDTO[]> {
  const PLACEHOLDER = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80";

  // Collect all unique GCS paths across all spaces
  const allPaths = spaces
    .flatMap((s: SpaceDTO) => (Array.isArray(s.images) ? s.images : []) as string[])
    .filter((p: string) => p && !p.startsWith("http")); // skip already-resolved URLs

  if (allPaths.length === 0) return spaces;

  const urlMap = await fetchSignedUrls([...new Set(allPaths)], "spaces");

  return spaces.map((space: SpaceDTO) => {
    const resolved = (Array.isArray(space.images) ? space.images as string[] : []).map(
      (p: string) => urlMap[p] || (p.startsWith("http") ? p : PLACEHOLDER)
    );
    return { ...space, images: resolved.length > 0 ? resolved : [PLACEHOLDER] };
  });
}

export function useSpaces(query: SpacesQuery = {}) {
  const [data, setData] = useState<SpacesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.limit !== undefined) params.append("limit", query.limit.toString());
      if (query.offset !== undefined) params.append("offset", query.offset.toString());
      if (query.category) params.append("category", query.category);
      if (query.accessType) params.append("accessType", query.accessType);
      if (query.minPrice !== undefined) params.append("minPrice", query.minPrice.toString());
      if (query.maxPrice !== undefined) params.append("maxPrice", query.maxPrice.toString());
      if (query.search) params.append("search", query.search);

      const response = await fetch(`${API_URL}/api/spaces?${params.toString()}`);
      if (!response.ok) throw new Error(`Failed to fetch spaces: ${response.statusText}`);

      const json = await response.json();

      // Resolve GCS paths → signed URLs for display
      if (json?.data?.length > 0) {
        json.data = await resolveSpaceImages(json.data);
      }

      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [
    query.limit, query.offset, query.category,
    query.accessType, query.minPrice, query.maxPrice, query.search,
  ]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  return { data, loading, error, refetch: fetchSpaces };
}
