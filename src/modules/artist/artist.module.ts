import { forwardRef, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { DbModule } from '../../db/db.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArtistEntity } from "./entities/artist.entity";

@Module({
  imports: [
    DbModule,
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoriteModule),
    TypeOrmModule.forFeature([ArtistEntity]),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
