import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumModule } from './modules/album/album.module';
import { ArtistModule } from './modules/artist/artist.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { TrackModule } from './modules/track/track.module';
import { UserModule } from './modules/user/user.module';
import { DbModule } from './db/db.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { AlbumEntity } from "./modules/album/entities/album.entity";
import { TrackEntity } from "./modules/track/entities/track.entity";
import { ArtistEntity } from "./modules/artist/entities/artist.entity";
import { UserEntity } from "./modules/user/entities/user.entity";

dotenv.config();

@Module({
  imports: [
    AlbumModule,
    ArtistModule,
    FavoriteModule,
    TrackModule,
    UserModule,
    DbModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      entities: [AlbumEntity, TrackEntity, ArtistEntity, UserEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
