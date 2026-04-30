import { db, spacesTable, usersTable, Space } from "@workspace/db";
import { and, eq, count, SQL, ilike, gte, lte, or } from "drizzle-orm";
import { SpaceRepository, FindAllPublishedOptions } from "../../domain/repositories/SpaceRepository";

export class DrizzleSpaceRepository implements SpaceRepository {
  async findById(id: number): Promise<Space | null> {
    const [result] = await db.select().from(spacesTable).where(eq(spacesTable.id, id));
    return (result as Space) ?? null;
  }

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
      where.push(eq(spacesTable.isVisible, true));
      // where.push(eq(spacesTable.status, "approved")); // Commented out for now to allow discovery
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

  async findAllAdmin(options: {
    limit?: number;
    offset?: number;
    ownerId?: string;
  }) {
    const { limit = 20, offset = 0, ownerId } = options;
    const where: (SQL | undefined)[] = [];

    if (ownerId) {
      where.push(eq(spacesTable.ownerId, ownerId));
    }

    const filters = where.length > 0 ? and(...where.filter(Boolean)) : undefined;

    const query = db.select({
        id: spacesTable.id,
        ownerId: spacesTable.ownerId,
        spaceType: spacesTable.spaceType,
        city: spacesTable.city,
        address: spacesTable.address,
        description: spacesTable.description,
        priceMonthly: spacesTable.priceMonthly,
        priceMonthlyNum: spacesTable.priceMonthlyNum,
        isVisible: spacesTable.isVisible,
        published: spacesTable.published,
        createdAt: spacesTable.createdAt,
        ownerName: usersTable.name,
        ownerEmail: usersTable.email
      })
      .from(spacesTable)
      .leftJoin(usersTable, eq(spacesTable.ownerId, usersTable.uid));
    
    if (filters) query.where(filters);
    
    const data = await query.limit(limit).offset(offset);

    const [{ value }] = await db.select({ value: count() })
      .from(spacesTable)
      .where(filters);

    const totalCount = Number(value);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      meta: {
        totalCount,
        totalPages,
      },
    };
  }

  async create(data: any): Promise<Space> {
    const [result] = await db.insert(spacesTable).values({
      ...data,
      published: false,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return result as Space;
  }

  async findByOwner(ownerId: string): Promise<Space[]> {
    return db.select().from(spacesTable).where(eq(spacesTable.ownerId, ownerId)) as Promise<Space[]>;
  }

  async update(id: number, ownerId: string, data: Partial<any>): Promise<Space | null> {
    const [result] = await db.update(spacesTable)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(spacesTable.id, id), eq(spacesTable.ownerId, ownerId)))
      .returning();
    return result as Space | null;
  }

  async delete(id: number, ownerId: string): Promise<void> {
    await db.delete(spacesTable).where(and(eq(spacesTable.id, id), eq(spacesTable.ownerId, ownerId)));
  }
}
