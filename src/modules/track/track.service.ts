import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { Track } from './models/track.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/track.dto';
import { FavoriteService } from "../favorite/favorite.service";
import { TrackEntity } from "./entities/track.entity";

@Injectable()
export class TrackService {
  constructor(private db: DbService, private favoriteService: FavoriteService) {}

  getAllTracks(): Track[] {
    return this.db.tracks;
  }

  getTrackById(id: string): Track | undefined {
    const track = this.db.tracks.find(({ id: userId }) => userId === id);
    return track ?? null;
  }

  createTrack(createTrackDto: CreateTrackDto): TrackEntity {
    const newTrack: Track = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.db.tracks.push(newTrack);
    return newTrack;
  }

  deleteTrack(id: string): void {
    const index = this.db.tracks.findIndex((track: Track) => track.id === id);
    this.favoriteService.removeTrack(id, true);
    this.db.tracks.splice(index, 1);
  }

  removeArtistId(id: string) {
    this.db.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
  }

  removeAlbumId(id: string) {
    this.db.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }
}
