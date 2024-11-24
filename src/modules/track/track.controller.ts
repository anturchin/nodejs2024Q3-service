import { TrackService } from './track.service';
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
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';
import { ErrorHandler } from '../../shared/error/error.handler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTracks(): Promise<Track[]> {
    try {
      return await this.trackService.getAllTracks();
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTrackById(@Param('id') id: string): Promise<Track> {
    try {
      return await this.trackService.getTrackById(id);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      return await this.trackService.createTrack(createTrackDto);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateTrack(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    try {
      return await this.trackService.updateTrack(id, updateTrackDto);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string): Promise<void> {
    try {
      await this.trackService.deleteTrack(id);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }
}
