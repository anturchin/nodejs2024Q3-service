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
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';
import { ErrorHandler } from '../../shared/error/error.handler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAlbums(): Promise<Album[]> {
    try {
      return await this.albumService.getAllAlbums();
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAlbumById(@Param('id') id: string): Promise<Album> {
    try {
      return await this.albumService.getAlbumById(id);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    try {
      return await this.albumService.createAlbum(createAlbumDto);
    } catch (error) {
      await this.errorHandler.handleError(error);
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
      await this.errorHandler.handleError(error);
    }
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string): Promise<void> {
    try {
      await this.albumService.deleteAlbum(id);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }
}
