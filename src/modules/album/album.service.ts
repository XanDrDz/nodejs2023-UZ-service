import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './models/album.interface';
import { CreateAlbumDto } from './dto/album.dto';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';
import { AlbumEntity } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    private db: DbService,
    private trackService: TrackService,
    private favoriteService: FavoriteService,
  ) {}

  getAllAlbums(): Album[] {
    return this.db.albums;
  }

  getAlbumById(id: string): AlbumEntity {
    return this.db.albums.find(({ id: albumId }) => albumId === id) ?? null;
  }

  createAlbum(createAlbumDto: CreateAlbumDto): AlbumEntity {
    const newAlbum: Album = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  deleteAlbum(id: string): AlbumEntity {
    const index = this.db.albums.findIndex((album: Album) => album.id === id);

    const [deletedAlbum] = this.db.albums.splice(index, 1);
    this.trackService.removeAlbumId(id);
    this.favoriteService.removeAlbum(id, true);

    return deletedAlbum;
  }

  removeArtistId(id: string) {
    this.db.albums.forEach((album: Album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }
}
