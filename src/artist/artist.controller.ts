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
import { ArtistService } from './artist.service';
import { Artist } from './entities/artist.entity';
import { ErrorHandler } from '../common/utils/error-handler.util';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllArtists(): Promise<Artist[]> {
    try {
      return await this.artistService.getAllArtists();
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getArtistById(@Param('id') id: string): Promise<Artist> {
    try {
      return await this.artistService.getArtistById(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArtist(
    @Body() createArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    try {
      return await this.artistService.createArtist(createArtistDto);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    try {
      return await this.artistService.updateArtist(id, updateArtistDto);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string): Promise<void> {
    try {
      await this.artistService.deleteArtist(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}
