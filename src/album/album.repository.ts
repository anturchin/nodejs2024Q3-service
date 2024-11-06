import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './entities/album.entity';
import { ErrorAlbumMessages } from '../common/constants/error-messages.constants';
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';

@Injectable()
export class AlbumRepository {
  private readonly albums: Album[] = [];

  async getAllAlbums(): Promise<Album[]> {
    return this.albums;
  }

  async getAlbumById(id: string): Promise<Album> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorAlbumMessages.INVALID_ALBUM_ID_FORMAT);
    }

    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(ErrorAlbumMessages.ALBUM_NOT_FOUND);
    }
    return album;
  }

  async createAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorAlbumMessages.INVALID_ALBUM_ID_FORMAT);
    }
    const album = this.albums.find((album) => album.id === id);
    if (!album) {
      throw new NotFoundException(ErrorAlbumMessages.ALBUM_NOT_FOUND);
    }

    Object.assign(album, updateAlbumDto);
    return album;
  }

  async deleteAlbum(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorAlbumMessages.INVALID_ALBUM_ID_FORMAT);
    }
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException(ErrorAlbumMessages.ALBUM_NOT_FOUND);
    }
    this.albums.splice(index, 1);
  }

  async resetArtisId(artistId: string): Promise<void> {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
