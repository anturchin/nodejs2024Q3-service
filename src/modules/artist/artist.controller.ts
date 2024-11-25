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
import { ArtistService } from './artist.service';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';
import { ErrorHandler } from '../../common/error/error.handler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllArtists(): Promise<Artist[]> {
    try {
      return await this.artistService.getAllArtists();
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getArtistById(@Param('id') id: string): Promise<Artist> {
    try {
      return await this.artistService.getArtistById(id);
    } catch (error) {
      await this.errorHandler.handleError(error);
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
      await this.errorHandler.handleError(error);
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
      await this.errorHandler.handleError(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string): Promise<void> {
    try {
      await this.artistService.deleteArtist(id);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }
}
