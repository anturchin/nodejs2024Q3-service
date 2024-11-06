import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponseDto } from './dtos/favorites-response.dto';
import { ErrorHandler } from '../common/utils/error-handler.util';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllFavorites(): Promise<FavoritesResponseDto> {
    try {
      return await this.favoritesService.getAllFavorites();
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id') id: string): Promise<void> {
    try {
      await this.favoritesService.addTrackToFavorites(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(@Param('id') id: string): Promise<void> {
    try {
      await this.favoritesService.removeTrackFromFavorites(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id') id: string): Promise<void> {
    try {
      await this.favoritesService.addAlbumToFavorites(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(@Param('id') id: string): Promise<void> {
    try {
      await this.favoritesService.removeAlbumFromFavorites(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id') id: string): Promise<void> {
    try {
      await this.favoritesService.addArtistToFavorites(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(@Param('id') id: string): Promise<void> {
    try {
      await this.favoritesService.removeArtistFromFavorites(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}
