import { v4 as uuidv4, validate as isUuid } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Artist } from './entities/artist.entity';
import { ErrorArtistMessages } from '../common/constants/error-messages.constants';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';

@Injectable()
export class ArtistRepository {
  private readonly artists: Artist[] = [];

  async getAllArtists(): Promise<Artist[]> {
    return this.artists;
  }

  async getArtistById(id: string): Promise<Artist> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        ErrorArtistMessages.INVALID_ARTIST_ID_FORMAT,
      );
    }

    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException(ErrorArtistMessages.ARTIST_NOT_FOUND);
    }
    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        ErrorArtistMessages.INVALID_ARTIST_ID_FORMAT,
      );
    }

    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new NotFoundException(ErrorArtistMessages.ARTIST_NOT_FOUND);
    }

    Object.assign(artist, updateArtistDto);
    return artist;
  }

  async deleteArtist(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        ErrorArtistMessages.INVALID_ARTIST_ID_FORMAT,
      );
    }

    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) {
      throw new NotFoundException(ErrorArtistMessages.ARTIST_NOT_FOUND);
    }

    this.artists.splice(index, 1);
  }

  async artistExists(id: string): Promise<boolean> {
    const index = this.artists.findIndex((artis) => artis.id === id);
    if (index === -1) {
      return false;
    }
    return true;
  }
}
