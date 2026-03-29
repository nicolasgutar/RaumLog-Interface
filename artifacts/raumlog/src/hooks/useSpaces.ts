import { useState, useEffect, useCallback } from "react";

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
      if (!response.ok) {
        throw new Error(`Failed to fetch spaces: ${response.statusText}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [
    query.limit, 
    query.offset, 
    query.category, 
    query.accessType, 
    query.minPrice, 
    query.maxPrice, 
    query.search
  ]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  return { data, loading, error, refetch: fetchSpaces };
}
