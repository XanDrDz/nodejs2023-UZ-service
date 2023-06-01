import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { validationID } from '../../utils/utils';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllAlbums() {
    this.albumService.getAllAlbums();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAlbumById(@Param('id') id: string) {
    validationID(id);
    const album = this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    if (
      !createAlbumDto ||
      createAlbumDto.name ||
      createAlbumDto.artistId ||
      createAlbumDto.year
    ) {
      throw new BadRequestException('Additional data required');
    }

    return this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateAlbumInfo(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('id') id: string,
  ) {
    validationID(id);
    const album = this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;

    return album;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    validationID(id);
    const album = this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    this.albumService.deleteAlbum(id);
  }
}
