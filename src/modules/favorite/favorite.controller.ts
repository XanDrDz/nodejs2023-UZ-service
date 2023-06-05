import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favs')
@UseInterceptors(ClassSerializerInterceptor)
export class FavoriteController {
  constructor(
    private favoriteService: FavoriteService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllFavs() {
    return this.favoriteService.getAllFavs();
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavs(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoriteService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.favoriteService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavs(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string,) {
    return this.favoriteService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string,) {
    this.favoriteService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavs(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string,) {
    return this.favoriteService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string,) {
    this.favoriteService.removeArtist(id);
  }
}
