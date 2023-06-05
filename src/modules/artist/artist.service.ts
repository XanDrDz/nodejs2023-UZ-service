import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './models/artist.interface';
import { CreateArtistDto } from './dto/artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    private db: DbService,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}

  getAllArtists(): Artist[] {
    return this.db.artists;
  }

  getArtistById(id: string): Artist | undefined {
    return this.db.artists.find((artist: Artist) => artist.id === id);
  }

  createArtist(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.db.artists.push(newArtist);
    return newArtist;
  }

  deleteArtist(id: string): void {
    const index = this.db.artists.findIndex(
      (artist: Artist) => artist.id === id,
    );
    this.albumService.removeArtistId(id);
    this.trackService.removeArtistId(id);
    this.db.artists.splice(index, 1);
  }
}
