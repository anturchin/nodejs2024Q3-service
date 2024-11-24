import { Injectable } from '@nestjs/common';
import { AlbumRepository } from '../../database/repositories/album.repository';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async getAllAlbums(): Promise<Album[]> {
    return await this.albumRepository.getAllAlbums();
  }

  async getAlbumById(id: string): Promise<Album> {
    return await this.albumRepository.getAlbumById(id);
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return await this.albumRepository.createAlbum(createAlbumDto);
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    return await this.albumRepository.updateAlbum(id, updateAlbumDto);
  }

  async deleteAlbum(id: string): Promise<void> {
    await this.albumRepository.deleteAlbum(id);
    await this.trackService.resetArtistAndAlbumId({ albumId: id });
    await this.favoritesService.handleEntityDeletion({
      id,
      entityType: 'albums',
    });
  }

  async resetArtisId(artistId: string): Promise<void> {
    await this.albumRepository.resetArtisId(artistId);
  }
}
