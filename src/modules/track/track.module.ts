import { forwardRef, Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRepository } from '../../database/repositories/track.repository';
import { FavoritesModule } from '../favorites/favorites.module';
import { DatabaseModule } from '../../database/database.module';
import { ErrorModule } from '../../shared/error/error.module';

@Module({
  imports: [forwardRef(() => FavoritesModule), DatabaseModule, ErrorModule],
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
  exports: [TrackService, TrackRepository],
})
export class TrackModule {}
