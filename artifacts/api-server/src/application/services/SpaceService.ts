import { SpaceRepository, FindAllPublishedOptions } from "../../domain/repositories/SpaceRepository";

export class SpaceService {
  constructor(private spaceRepository: SpaceRepository) {}

  async getSpaceById(id: number) {
    const space = await this.spaceRepository.findById(id);
    if (!space) throw new Error("Space not found");
    return space;
  }

  async getMarketplaceSpaces(options: FindAllPublishedOptions) {
    return this.spaceRepository.findAllPublished(options);
  }

  async getSpacesByOwner(ownerId: string) {
    return (this.spaceRepository as any).findByOwner(ownerId);
  }

  async createSpace(data: any, ownerId: string) {
    return (this.spaceRepository as any).create({ ...data, ownerId });
  }

  async updateSpace(id: number, ownerId: string, data: any) {
    return (this.spaceRepository as any).update(id, ownerId, data);
  }

  async deleteSpace(id: number, ownerId: string) {
    return (this.spaceRepository as any).delete(id, ownerId);
  }
}
