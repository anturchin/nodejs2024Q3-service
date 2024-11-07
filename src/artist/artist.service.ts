import { Injectable } from '@nestjs/common';
import { ArtistRepository } from './artist.repository';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  async getAllArtists(): Promise<Artist[]> {
    return await this.artistRepository.getAllArtists();
  }

  async getArtistById(id: string): Promise<Artist> {
    return await this.artistRepository.getArtistById(id);
  }

  async createArtist(createArtistDto: CreateArtistDto): Promise<Artist> {
    return await this.artistRepository.createArtist(createArtistDto);
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    return await this.artistRepository.updateArtist(id, updateArtistDto);
  }

  async deleteArtist(id: string): Promise<void> {
    await this.artistRepository.deleteArtist(id);
    await this.trackService.resetArtistAndAlbumId({ artistId: id });
    await this.albumService.resetArtisId(id);
  }
}
