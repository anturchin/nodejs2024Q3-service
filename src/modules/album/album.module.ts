import { forwardRef, Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumRepository } from './album.repository';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { DatabaseModule } from '../../database/database.module';
import { ErrorModule } from '../../error/error.module';

@Module({
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    DatabaseModule,
    ErrorModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
  exports: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
