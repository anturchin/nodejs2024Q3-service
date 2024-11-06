import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { Track } from './entities/track.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorTrackMessages } from '../common/constants/error-messages.constants';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';

@Injectable()
export class TrackRepository {
  private readonly tracks: Track[] = [];

  async getAllTracks(): Promise<Track[]> {
    return this.tracks;
  }

  async getTrackById(id: string): Promise<Track> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorTrackMessages.INVALID_TRACK_ID_FORMAT);
    }

    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(ErrorTrackMessages.TRACK_NOT_FOUND);
    }
    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  async updateTrack(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorTrackMessages.INVALID_TRACK_ID_FORMAT);
    }
    const track = this.tracks.find((track) => track.id === id);
    if (!track) {
      throw new NotFoundException(ErrorTrackMessages.TRACK_NOT_FOUND);
    }

    Object.assign(track, updateTrackDto);
    return track;
  }

  async deleteTrack(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorTrackMessages.INVALID_TRACK_ID_FORMAT);
    }
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) {
      throw new NotFoundException(ErrorTrackMessages.TRACK_NOT_FOUND);
    }
    this.tracks.splice(index, 1);
  }

  async resetArtistAndAlbumId({
    artistId,
    albumId,
  }: {
    artistId?: string;
    albumId?: string;
  }): Promise<void> {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
