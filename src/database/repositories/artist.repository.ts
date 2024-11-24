import { validate as isUuid } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorArtistMessages } from '../../shared/constants/error-messages.constants';
import { CreateArtistDto } from '../../modules/artist/dtos/create-artist.dto';
import { UpdateArtistDto } from '../../modules/artist/dtos/update-artist.dto';
import { Artist } from '@prisma/client';
import { DatabaseService } from '../database.service';

@Injectable()
export class ArtistRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllArtists(): Promise<Artist[]> {
    return this.db.artist.findMany();
  }

  async getArtistById(id: string): Promise<Artist> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        ErrorArtistMessages.INVALID_ARTIST_ID_FORMAT,
      );
    }

    const artist = await this.db.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(ErrorArtistMessages.ARTIST_NOT_FOUND);
    }
    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = await this.db.artist.create({
      data: {
        ...createArtistDto,
      },
    });
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
    const artist = await this.db.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(ErrorArtistMessages.ARTIST_NOT_FOUND);
    }
    return this.db.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async deleteArtist(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(
        ErrorArtistMessages.INVALID_ARTIST_ID_FORMAT,
      );
    }
    const artist = await this.db.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new NotFoundException(ErrorArtistMessages.ARTIST_NOT_FOUND);
    }
    await this.db.artist.delete({ where: { id } });
  }

  async artistExists(id: string): Promise<boolean> {
    const artist = await this.db.artist.findUnique({ where: { id } });
    return !!artist;
  }
}