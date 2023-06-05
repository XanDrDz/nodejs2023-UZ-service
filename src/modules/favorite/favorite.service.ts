import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { FavouritesEntity } from './entity/favorite.entity';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoriteService {
  constructor(
    private db: DbService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

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

  addAlbumMain(id: string, entityType: string) {
    const entity = this[`${entityType}Service`].getAlbumById(id);
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

  addArtistMain(id: string, entityType: string) {
    const entity = this[`${entityType}Service`].getArtistById(id);
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

  addTrackMain(id: string, entityType: string) {
    const entity = this[`${entityType}Service`].getTrackById(id);
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

  remove(id: string, entityType: string, flag: boolean) {
    const entityIdx = this.db.favorites[`${entityType}s`].findIndex(
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
      this.db.favorites[`${entityType}s`].splice(entityIdx, 1);
    }
    return { message: `${entityType.toUpperCase()} successfully deleted` };
  }

  addAlbum(id: string) {
    return this.addAlbumMain(id, 'album');
  }

  addTrack(id: string) {
    return this.addTrackMain(id, 'track');
  }

  addArtist(id: string) {
    return this.addArtistMain(id, 'artist');
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
