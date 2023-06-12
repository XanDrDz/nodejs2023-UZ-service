import { forwardRef, Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { DbModule } from '../../db/db.module';
import { TrackModule } from '../track/track.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlbumEntity } from "./entities/album.entity";


@Module({
  imports: [
    DbModule,
    TrackModule,
    forwardRef(() => FavoriteModule),
    TypeOrmModule.forFeature([AlbumEntity]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
