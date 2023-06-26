import { forwardRef, Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { DbModule } from '../../db/db.module';
import { ArtistModule } from '../artist/artist.module';
import { FavoriteModule } from '../favorite/favorite.module';

@Module({
  imports: [DbModule, forwardRef(() => FavoriteModule)],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
