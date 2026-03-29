import { db, spacesTable, Space } from "@workspace/db";
import { and, eq, count, SQL, ilike, gte, lte, or } from "drizzle-orm";
import { SpaceRepository, FindAllPublishedOptions } from "../../domain/repositories/SpaceRepository";

export class DrizzleSpaceRepository implements SpaceRepository {
  async findAllPublished(options: FindAllPublishedOptions) {
    const { 
      limit = 12, 
      offset = 0, 
      category, 
      accessType, 
      minPrice, 
      maxPrice, 
      search,
      ownerId
    } = options;

    const where: (SQL | undefined)[] = [];

    if (ownerId) {
      where.push(eq(spacesTable.ownerId, ownerId));
    } else {
      where.push(eq(spacesTable.published, true));
      where.push(eq(spacesTable.status, "approved"));
    }

    if (category) {
      where.push(eq(spacesTable.category, category as any));
    }

    if (accessType) {
      where.push(eq(spacesTable.accessType, accessType as any));
    }

    if (minPrice !== undefined) {
      where.push(gte(spacesTable.priceMonthlyNum, minPrice));
    }

    if (maxPrice !== undefined) {
      where.push(lte(spacesTable.priceMonthlyNum, maxPrice));
    }

    if (search) {
      const searchTerm = `%${search}%`;
      where.push(
        or(
          ilike(spacesTable.city, searchTerm),
          ilike(spacesTable.spaceType, searchTerm),
          ilike(spacesTable.description, searchTerm)
        )
      );
    }

    const filters = and(...where.filter(Boolean));

    const data = await db.select()
      .from(spacesTable)
      .where(filters)
      .limit(limit)
      .offset(offset);

    const [{ value }] = await db.select({ value: count() })
      .from(spacesTable)
      .where(filters);

    const totalCount = Number(value);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: data as Space[],
      meta: {
        totalCount,
        totalPages,
      },
    };
  }

  async create(data: any): Promise<Space> {
    const [result] = await db.insert(spacesTable).values({
      ...data,
      published: false, // Force draft state on creation
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result as Space;
  }
}
