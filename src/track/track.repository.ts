import { validate as isUuid } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorTrackMessages } from '../common/constants/error-messages.constants';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';
import { Track } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class TrackRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllTracks(): Promise<Track[]> {
    return await this.db.track.findMany();
  }

  async getTrackById(id: string): Promise<Track> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorTrackMessages.INVALID_TRACK_ID_FORMAT);
    }

    const track = await this.db.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(ErrorTrackMessages.TRACK_NOT_FOUND);
    }
    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.db.track.create({
      data: createTrackDto,
    });
  }

  async updateTrack(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorTrackMessages.INVALID_TRACK_ID_FORMAT);
    }
    const track = await this.db.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(ErrorTrackMessages.TRACK_NOT_FOUND);
    }
    return await this.db.track.update({
      where: { id },
      data: updateTrackDto,
    });
  }

  async deleteTrack(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorTrackMessages.INVALID_TRACK_ID_FORMAT);
    }
    const track = await this.db.track.findUnique({ where: { id } });
    if (!track) {
      throw new NotFoundException(ErrorTrackMessages.TRACK_NOT_FOUND);
    }
    await this.db.track.delete({ where: { id } });
  }

  async resetArtistAndAlbumId({
    artistId,
    albumId,
  }: {
    artistId?: string;
    albumId?: string;
  }): Promise<void> {
    if (artistId) {
      await this.db.track.updateMany({
        where: { artistId },
        data: { artistId: null },
      });
    }
    if (albumId) {
      await this.db.track.updateMany({
        where: { albumId },
        data: { albumId: null },
      });
    }
  }

  async trackExists(id: string): Promise<boolean> {
    const track = await this.db.track.findUnique({ where: { id } });
    return !!track;
  }
}
