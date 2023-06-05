import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { FavouritesEntity } from "./entity/favorite.entity";

@Injectable()
export class FavoriteService {
  constructor(private db: DbService) {}

  getAllFavs() {
    const { artists, albums, tracks } = this.db.favorites;

    const favourites: FavouritesEntity = new FavouritesEntity();

    favourites.artists = artists.map((id) =>
      this.db.artists.find((artist) => artist.id === id),
    );

    favourites.albums = albums.map((id) =>
      this.db.albums.find((album) => album.id === id),
    );

    favourites.tracks = tracks.map((id) =>
      this.db.tracks.find((track) => track.id === id),
    );
    return favourites;
  }

  add(id: string, entityType: string) {
    const entity = this[`${entityType}Service`].findOne(id);
    if (!entity)
      throw new HttpException(
        `${entityType.toUpperCase()} with id:${id} not found`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    this.db.favorites[`${entityType}s`].push(id);
    return {
      message: `${entityType.toUpperCase()} successfully added to favourites`,
    };
  }

  async remove(id: string, entityType: string, flag: boolean) {
    const entityIdx = await this.db.favorites[`${entityType}s`].findIndex(
      (entityId) => entityId === id,
    );
    if (entityIdx === -1) {
      if (!flag) {
        throw new HttpException(
          `${entityType.toUpperCase()} with id:${id} is not favorite`,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      await this.db.favorites[`${entityType}s`].splice(entityIdx, 1);
    }
    return { message: `${entityType.toUpperCase()} successfully deleted` };
  }

  async addAlbum(id: string) {
    return this.add(id, 'album');
  }
  async addTrack(id: string) {
    return this.add(id, 'track');
  }
  addArtist(id: string) {
    return this.add(id, 'artist');
  }

  removeAlbum(id: string, flag = false) {
    return this.remove(id, 'album', flag);
  }
  removeTrack(id: string, flag = false) {
    return this.remove(id, 'track', flag);
  }
  removeArtist(id: string, flag = false) {
    return this.remove(id, 'artist', flag);
  }
}
