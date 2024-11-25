import { TrackRepository } from '../../database/repositories/track.repository';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';
import { Injectable } from '@nestjs/common';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly favoritesService: FavoritesService,
  ) {}

  async getAllTracks(): Promise<Track[]> {
    return await this.trackRepository.getAllTracks();
  }

  async getTrackById(id: string): Promise<Track> {
    return await this.trackRepository.getTrackById(id);
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.trackRepository.createTrack(createTrackDto);
  }

  async updateTrack(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    return await this.trackRepository.updateTrack(id, updateTrackDto);
  }

  async deleteTrack(id: string): Promise<void> {
    await this.trackRepository.deleteTrack(id);
    await this.favoritesService.handleEntityDeletion({
      id,
      entityType: 'tracks',
    });
  }

  async resetArtistAndAlbumId({
    albumId,
    artistId,
  }: {
    artistId?: string;
    albumId?: string;
  }) {
    await this.trackRepository.resetArtistAndAlbumId({ albumId, artistId });
  }
}
