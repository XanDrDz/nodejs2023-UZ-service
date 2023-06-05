import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param, ParseUUIDPipe,
  Post
} from "@nestjs/common";
import { FavoriteService } from './favorite.service';
import { validationID } from '../../utils/utils';
import { TrackService } from '../track/track.service';
import { Favorites, FavoritesResponse } from "./models/favorite.interface";
import { AlbumService } from "../album/album.service";
import { ArtistService } from "../artist/artist.service";

@Controller('favs')
export class FavoriteController {
  constructor(
    private favoriteService: FavoriteService,
    private trackService: TrackService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllFavs() {
    return this.favoriteService.getAllFavs();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavs(@Param('id') id: string) {
    validationID(id);
    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return this.favoriteService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string,) {
    validationID(id);
    return this.favoriteService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavs(@Param('id') id: string) {
    validationID(id);
    const album = this.albumService.getAlbumById(id);
    if (!album) {
      throw new HttpException(
        'Album does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return this.favoriteService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    validationID(id);
    this.favoriteService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavs(@Param('id') id: string) {
    validationID(id);
    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new HttpException(
        'Artist does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return this.favoriteService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    validationID(id);
    this.favoriteService.removeArtist(id);
  }
}
