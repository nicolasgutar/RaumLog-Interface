import { Space } from "@workspace/db";

export interface FindAllPublishedOptions {
  limit?: number;
  offset?: number;
  category?: string;
  accessType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  ownerId?: string;
}

export interface SpaceRepository {
  findAllPublished(options: FindAllPublishedOptions): Promise<{
    data: Space[];
    meta: {
      totalCount: number;
      totalPages: number;
    };
  }>;
  create(data: any): Promise<Space>;
}
