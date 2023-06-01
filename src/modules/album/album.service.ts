import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './models/album.interface';
import { CreateAlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumService {
  constructor(private db: DbService) {}

  getAllAlbums(): Album[] {
    return this.db.albums;
  }

  getAlbumById(id: string): Album | undefined {
    return this.db.albums.find((album: Album) => album.id === id);
  }

  createAlbum(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId,
    };
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  deleteAlbum(id: string): void {
    const index = this.db.albums.findIndex((album: Album) => album.id === id);
    this.db.albums.splice(index, 1);
  }
}
