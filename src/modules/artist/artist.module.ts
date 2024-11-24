import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';
import { ArtistRepository } from '../../database/repositories/artist.repository';
import { FavoritesModule } from '../favorites/favorites.module';
import { DatabaseModule } from '../../database/database.module';
import { ErrorModule } from '../../shared/error/error.module';

@Module({
  imports: [
    TrackModule,
    forwardRef(() => AlbumModule),
    forwardRef(() => FavoritesModule),
    DatabaseModule,
    ErrorModule,
  ],
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository],
  exports: [ArtistService, ArtistRepository],
})
export class ArtistModule {}