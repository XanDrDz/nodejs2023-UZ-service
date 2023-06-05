import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './models/artist.interface';
import { CreateArtistDto } from './dto/artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    private db: DbService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private favouritesService: FavoriteService,
  ) {}

  getAllArtists(): Artist[] {
    return this.db.artists;
  }

  getArtistById(id: string): ArtistEntity {
    const artist = this.db.artists.find((artist) => artist.id === id);
    return artist ?? null;
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

  deleteArtist(id: string): ArtistEntity {
    const index = this.db.artists.findIndex(
      (artist: Artist) => artist.id === id,
    );
    this.albumService.removeArtistId(id);
    this.trackService.removeArtistId(id);
    this.favouritesService.removeArtist(id, true);
    const [deletedArtist] = this.db.artists.splice(index, 1);
    return deletedArtist;
  }
}
