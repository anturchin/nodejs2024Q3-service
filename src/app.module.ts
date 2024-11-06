import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TrackModule } from './track/track.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
