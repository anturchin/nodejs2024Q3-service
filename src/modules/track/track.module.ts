import { forwardRef, Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRepository } from './track.repository';
import { FavoritesModule } from '../favorites/favorites.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [forwardRef(() => FavoritesModule), DatabaseModule],
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
  exports: [TrackService, TrackRepository],
})
export class TrackModule {}
