import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './modules/album/album.module';
import { ArtistModule } from './modules/artist/artist.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { TrackModule } from './modules/track/track.module';
import { UserModule } from './modules/user/user.module';
import { DbService } from './db/db.service';

@Module({
  imports: [AlbumModule, ArtistModule, FavoriteModule, TrackModule, UserModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
