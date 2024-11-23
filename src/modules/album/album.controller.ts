import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { ErrorHandler } from '../../common/utils/error-handler.util';
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAlbums(): Promise<Album[]> {
    try {
      return await this.albumService.getAllAlbums();
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAlbumById(@Param('id') id: string): Promise<Album> {
    try {
      return await this.albumService.getAlbumById(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    try {
      return await this.albumService.createAlbum(createAlbumDto);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbum: UpdateAlbumDto,
  ): Promise<Album> {
    try {
      return await this.albumService.updateAlbum(id, updateAlbum);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string): Promise<void> {
    try {
      await this.albumService.deleteAlbum(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}
