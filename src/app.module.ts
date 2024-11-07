import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ArtistModule } from './artist/artist.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    ArtistModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
