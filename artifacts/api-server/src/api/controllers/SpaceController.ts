import { Request, Response } from "express";
import { SpaceService } from "../../application/services/SpaceService";
import { spacesQuerySchema } from "@workspace/api-zod";

export class SpaceController {
  constructor(private spaceService: SpaceService) {}

  async getSpaces(req: Request, res: Response) {
    try {
      const parsed = spacesQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid query parameters", details: parsed.error.issues });
      }
      const result = await this.spaceService.getMarketplaceSpaces(parsed.data);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getMySpaces(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const result = await this.spaceService.getSpacesByOwner(uid);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async createSpace(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const result = await this.spaceService.createSpace(req.body, uid);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateSpace(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const id = parseInt(req.params.id as string, 10);
      const result = await this.spaceService.updateSpace(id, uid, req.body);
      if (!result) return res.status(404).json({ error: "Space not found or unauthorized" });
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteSpace(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const id = parseInt(req.params.id as string, 10);
      await this.spaceService.deleteSpace(id, uid);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
