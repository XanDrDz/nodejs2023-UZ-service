import { forwardRef, Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { ArtistModule } from '../artist/artist.module';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';
import { DbModule } from '../../db/db.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FavouritesEntity } from "./entity/favorite.entity";
import { ArtistEntity } from "../artist/entities/artist.entity";
import { AlbumEntity } from "../album/entities/album.entity";
import { TrackEntity } from "../track/entities/track.entity";

@Module({
  imports: [
    forwardRef(() => ArtistModule),
    forwardRef(() => TrackModule),
    forwardRef(() => AlbumModule),
    DbModule,
    TypeOrmModule.forFeature([FavouritesEntity]),
    TypeOrmModule.forFeature([ArtistEntity]),
    TypeOrmModule.forFeature([AlbumEntity]),
    TypeOrmModule.forFeature([TrackEntity])
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
