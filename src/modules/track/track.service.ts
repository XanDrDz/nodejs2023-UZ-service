import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { Track } from './models/track.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/track.dto';

@Injectable()
export class TrackService {
  constructor(private db: DbService) {}

  getAllTracks(): Track[] {
    return this.db.tracks;
  }

  getTrackById(id: string): Track | undefined {
    return this.db.tracks.find((track: Track) => track.id === id);
  }

  createTrack(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: createTrackDto.name,
      albumId: createTrackDto.albumId,
      artistId: createTrackDto.artistId,
      duration: createTrackDto.duration,
    };
    this.db.tracks.push(newTrack);
    return newTrack;
  }

  deleteTrack(id: string): void {
    const index = this.db.tracks.findIndex((track: Track) => track.id === id);
    this.db.tracks.splice(index, 1);
  }
}
