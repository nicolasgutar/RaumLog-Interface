import { Request, Response } from 'express';
import { db, spacesTable, reservationsTable } from '@workspace/db';
import { eq, and, ne, inArray, count } from 'drizzle-orm';
import { DrizzleSpaceRepository } from '../../../infrastructure/repositories/DrizzleSpaceRepository';

const spaceRepository = new DrizzleSpaceRepository();

export class AdminSpaceController {
  async listSpaces(req: Request, res: Response) {
    try {
      const { limit = 20, page = 1, ownerId } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const result = await spaceRepository.findAllAdmin({
        limit: Number(limit),
        offset,
        ownerId: ownerId as string
      });

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async toggleVisibility(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { isVisible } = req.body;

      if (typeof isVisible !== 'boolean') {
        return res.status(400).json({ error: 'isVisible must be a boolean' });
      }

      const [updated] = await db.update(spacesTable)
        .set({ isVisible, updatedAt: new Date() })
        .where(eq(spacesTable.id, Number(id)))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Space not found' });
      }

      return res.status(200).json({ space: updated });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async deleteSpace(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const spaceId = Number(id);

      // Check for active reservations
      // Active = NOT completed AND NOT rejected
      const activeReservations = await db.select({ count: count() })
        .from(reservationsTable)
        .where(
          and(
            eq(reservationsTable.spaceId, spaceId),
            ne(reservationsTable.status, 'completed'),
            ne(reservationsTable.status, 'rejected')
          )
        );

      if (Number(activeReservations[0].count) > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete space with active reservations. Reservations must be completed or rejected first.' 
        });
      }

      await db.delete(spacesTable).where(eq(spacesTable.id, spaceId));

      return res.status(200).json({ message: 'Space deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async getSpaceDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const space = await db.query.spacesTable.findFirst({
        where: eq(spacesTable.id, Number(id))
      });

      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }

      return res.status(200).json({ space });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
