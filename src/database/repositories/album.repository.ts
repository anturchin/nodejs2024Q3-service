import { validate as isUuid } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ErrorAlbumMessages } from '../../common/constants/error-messages.constants';
import { CreateAlbumDto } from '../../modules/album/dtos/create-album.dto';
import { UpdateAlbumDto } from '../../modules/album/dtos/update-album.dto';
import { Album } from '@prisma/client';
import { DatabaseService } from '../database.service';

@Injectable()
export class AlbumRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllAlbums(): Promise<Album[]> {
    return this.db.album.findMany();
  }

  async getAlbumById(id: string): Promise<Album> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorAlbumMessages.INVALID_ALBUM_ID_FORMAT);
    }

    const album = await this.db.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException(ErrorAlbumMessages.ALBUM_NOT_FOUND);
    }
    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = await this.db.album.create({
      data: {
        ...createAlbumDto,
      },
    });
    return newAlbum;
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorAlbumMessages.INVALID_ALBUM_ID_FORMAT);
    }
    const album = await this.db.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException(ErrorAlbumMessages.ALBUM_NOT_FOUND);
    }
    return this.db.album.update({
      where: { id },
      data: updateAlbumDto,
    });
  }

  async deleteAlbum(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorAlbumMessages.INVALID_ALBUM_ID_FORMAT);
    }
    const album = await this.db.album.findUnique({ where: { id } });
    if (!album) {
      throw new NotFoundException(ErrorAlbumMessages.ALBUM_NOT_FOUND);
    }
    await this.db.album.delete({ where: { id } });
  }

  async resetArtisId(artistId: string): Promise<void> {
    await this.db.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async albumExists(id: string): Promise<boolean> {
    const album = await this.db.album.findUnique({ where: { id } });
    return !!album;
  }
}
