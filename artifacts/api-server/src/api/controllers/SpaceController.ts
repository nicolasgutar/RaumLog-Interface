import { Request, Response } from "express";
import { SpaceService } from "../../application/services/SpaceService";
import { spacesQuerySchema } from "@workspace/api-zod";

export class SpaceController {
  constructor(private spaceService: SpaceService) {}

  async getSpaces(req: Request, res: Response) {
    try {
      const parsed = spacesQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid query parameters", 
          details: parsed.error.issues 
        });
      }

      const result = await this.spaceService.getMarketplaceSpaces(parsed.data);
      return res.json(result);
    } catch (error) {
      console.error("Error in getSpaces controller:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async createSpace(req: Request, res: Response) {
    try {
      const { uid } = (req as any).user;
      const result = await this.spaceService.createSpace(req.body, uid);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error in createSpace controller:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
