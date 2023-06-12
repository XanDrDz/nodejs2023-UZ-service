import { forwardRef, Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { DbModule } from '../../db/db.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrackEntity } from "./entities/track.entity";

@Module({
  imports: [DbModule, forwardRef(() => FavoriteModule),
    TypeOrmModule.forFeature([TrackEntity])],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
