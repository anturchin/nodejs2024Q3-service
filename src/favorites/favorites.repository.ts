import { validate as isUuid } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites } from './entities/favorite.entity';
import { FavoritesResponseDto } from './dtos/favorites-response.dto';
import {
  ErrorAlbumMessages,
  ErrorArtistMessages,
  ErrorFavoritesMessages,
  ErrorTrackMessages,
} from '../common/constants/error-messages.constants';
import { TrackRepository } from '../track/track.repository';
import { AlbumRepository } from '../album/album.repository';
import { ArtistRepository } from '../artist/artist.repository';

@Injectable()
export class FavoritesRepository {
  private readonly favorites: Favorites = {
    albums: [],
    artists: [],
    tracks: [],
  };

  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async getAllFavorites(): Promise<FavoritesResponseDto> {
    const artistsAll = await this.artistRepository.getAllArtists();
    const albumsAll = await this.albumRepository.getAllAlbums();
    const tracksAll = await this.trackRepository.getAllTracks();

    const artists = artistsAll.filter((artist) =>
      this.favorites.artists.includes(artist.id),
    );
    const albums = albumsAll.filter((album) =>
      this.favorites.albums.includes(album.id),
    );
    const tracks = tracksAll.filter((track) =>
      this.favorites.tracks.includes(track.id),
    );

    return { artists, tracks, albums };
  }

  async addTrackToFavorites(id: string): Promise<void> {
    await this.addToFavorites({
      entityType: 'tracks',
      id,
      entityExistsCheck: this.trackRepository.trackExists.bind(
        this.trackRepository,
      ),
      invalidIdMessage:
        ErrorFavoritesMessages.INVALID_FAVORITES_TRACK_ID_FORMAT,
      notFoundMessage: ErrorTrackMessages.TRACK_NOT_FOUND,
    });
  }

  async removeTrackFromFavorites(id: string): Promise<void> {
    await this.removeFromFavorites({
      entityType: 'tracks',
      id,
      invalidIdMessage:
        ErrorFavoritesMessages.INVALID_FAVORITES_TRACK_ID_FORMAT,
      notFoundMessage: ErrorFavoritesMessages.FAVORITES_TRACK_NOT_FOUND,
    });
  }

  async addArtistToFavorites(id: string): Promise<void> {
    await this.addToFavorites({
      entityType: 'artists',
      id,
      entityExistsCheck: this.artistRepository.artistExists.bind(
        this.artistRepository,
      ),
      invalidIdMessage:
        ErrorFavoritesMessages.INVALID_FAVORITES_ARTIST_ID_FORMAT,
      notFoundMessage: ErrorArtistMessages.ARTIST_NOT_FOUND,
    });
  }

  async removeArtistFromFavorites(id: string): Promise<void> {
    await this.removeFromFavorites({
      entityType: 'artists',
      id,
      invalidIdMessage:
        ErrorFavoritesMessages.INVALID_FAVORITES_ARTIST_ID_FORMAT,
      notFoundMessage: ErrorFavoritesMessages.FAVORITES_ARTIST_NOT_FOUND,
    });
  }

  async addAlbumToFavorites(id: string): Promise<void> {
    await this.addToFavorites({
      entityType: 'albums',
      id,
      entityExistsCheck: this.albumRepository.albumExists.bind(
        this.albumRepository,
      ),
      invalidIdMessage:
        ErrorFavoritesMessages.INVALID_FAVORITES_ALBUM_ID_FORMAT,
      notFoundMessage: ErrorAlbumMessages.ALBUM_NOT_FOUND,
    });
  }

  async removeAlbumFromFavorites(id: string): Promise<void> {
    await this.removeFromFavorites({
      entityType: 'albums',
      id,
      invalidIdMessage:
        ErrorFavoritesMessages.INVALID_FAVORITES_ALBUM_ID_FORMAT,
      notFoundMessage: ErrorFavoritesMessages.FAVORITES_ALBUM_NOT_FOUND,
    });
  }

  async handleEntityDeletion({
    id,
    entityType,
  }: {
    id: string;
    entityType: keyof Favorites;
  }): Promise<void> {
    const entityList = this.favorites[entityType] as string[];
    this.favorites[entityType] = entityList.filter((item) => item !== id);
  }

  private async addToFavorites({
    entityType,
    id,
    entityExistsCheck,
    invalidIdMessage,
    notFoundMessage,
  }: {
    entityType: keyof Favorites;
    id: string;
    entityExistsCheck: <T>(id: string) => Promise<T>;
    invalidIdMessage: string;
    notFoundMessage: string;
  }): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(invalidIdMessage);
    }

    const entityExists = await entityExistsCheck(id);

    if (!entityExists) {
      throw new UnprocessableEntityException(notFoundMessage);
    }

    if (!this.favorites[entityType].includes(id)) {
      this.favorites[entityType].push(id);
    }
  }

  private async removeFromFavorites({
    entityType,
    id,
    invalidIdMessage,
    notFoundMessage,
  }: {
    entityType: keyof Favorites;
    id: string;
    invalidIdMessage: string;
    notFoundMessage: string;
  }): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(invalidIdMessage);
    }

    if (this.favorites[entityType].includes(id)) {
      this.favorites[entityType] = this.favorites[entityType].filter(
        (item: unknown) => item !== id,
      );
    } else {
      throw new NotFoundException(notFoundMessage);
    }
  }
}
