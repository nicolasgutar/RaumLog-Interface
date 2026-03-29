import { SpaceRepository, FindAllPublishedOptions } from "../../domain/repositories/SpaceRepository";

export class SpaceService {
  constructor(private spaceRepository: SpaceRepository) {}

  async getMarketplaceSpaces(options: FindAllPublishedOptions) {
    return this.spaceRepository.findAllPublished(options);
  }

  async createSpace(data: any, ownerId: string) {
    // In a real scenario, we'd use a CreateSpaceDTO
    return (this.spaceRepository as any).create({ ...data, ownerId });
  }
}
