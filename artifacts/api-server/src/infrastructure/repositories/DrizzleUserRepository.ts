import { db, usersTable, kycSubmissionsTable } from "@workspace/db";
import { and, eq, count, or, ilike, asc, desc, type SQL } from "drizzle-orm";

export class DrizzleUserRepository {
  async findByUid(uid: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.uid, uid),
    });
    
    if (!user) return null;
    
    // Join with KYC
    const kyc = await db.query.kycSubmissionsTable.findFirst({
        where: eq(kycSubmissionsTable.hostEmail, user.email),
        orderBy: (sub, { desc }) => [desc(sub.createdAt)]
    });

    return { ...user, kyc };
  }

  async findAllPaginated(params: {
    limit: number;
    offset: number;
    search?: string;
    sortBy?: 'name_asc' | 'name_desc';
  }) {
    const { limit = 20, offset = 0, search, sortBy = 'name_asc' } = params;
    const where: (SQL | undefined)[] = [];

    if (search) {
      const searchTerm = `%${search}%`;
      where.push(
        or(
          ilike(usersTable.name, searchTerm),
          ilike(usersTable.email, searchTerm)
        )
      );
    }

    const filters = where.length > 0 ? and(...where.filter(Boolean)) : undefined;
    
    const query = db.select().from(usersTable);
    if (filters) query.where(filters);
    
    if (sortBy === 'name_asc') {
      query.orderBy(asc(usersTable.name));
    } else {
      query.orderBy(desc(usersTable.name));
    }

    const data = await query.limit(limit).offset(offset);

    const [{ value }] = await db.select({ value: count() })
      .from(usersTable)
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

  async updateVerification(uid: string, isVerified: boolean) {
    const [result] = await db.update(usersTable)
      .set({ isUserVerified: isVerified, updatedAt: new Date() })
      .where(eq(usersTable.uid, uid))
      .returning();
    return result;
  }
}
