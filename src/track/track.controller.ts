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
} from '@nestjs/common';
import { Track } from './entities/track.entity';
import { ErrorHandler } from '../common/utils/error-handler.util';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTracks(): Promise<Track[]> {
    try {
      return await this.trackService.getAllTracks();
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getTrackById(@Param('id') id: string): Promise<Track> {
    try {
      return await this.trackService.getTrackById(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      return await this.trackService.createTrack(createTrackDto);
    } catch (error) {
      ErrorHandler.handleError(error);
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
      ErrorHandler.handleError(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string): Promise<void> {
    try {
      await this.trackService.deleteTrack(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}
