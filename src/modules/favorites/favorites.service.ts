import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from '../../database/repositories/favorites.repository';
import { Favorites } from './entities/favorite.entity';
import { FavoritesResponseDto } from './dtos/favorites-response.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  async getAllFavorites(): Promise<FavoritesResponseDto> {
    return await this.favoritesRepository.getAllFavorites();
  }

  async addTrackToFavorites(id: string): Promise<void> {
    await this.favoritesRepository.addTrackToFavorites(id);
  }

  async removeTrackFromFavorites(id: string): Promise<void> {
    await this.favoritesRepository.removeTrackFromFavorites(id);
  }

  async addArtistToFavorites(id: string): Promise<void> {
    await this.favoritesRepository.addArtistToFavorites(id);
  }

  async removeArtistFromFavorites(id: string): Promise<void> {
    await this.favoritesRepository.removeArtistFromFavorites(id);
  }

  async addAlbumToFavorites(id: string): Promise<void> {
    await this.favoritesRepository.addAlbumToFavorites(id);
  }

  async removeAlbumFromFavorites(id: string): Promise<void> {
    await this.favoritesRepository.removeAlbumFromFavorites(id);
  }

  async handleEntityDeletion({
    id,
    entityType,
  }: {
    id: string;
    entityType: keyof Favorites;
  }): Promise<void> {
    await this.favoritesRepository.handleEntityDeletion({ id, entityType });
  }
}
