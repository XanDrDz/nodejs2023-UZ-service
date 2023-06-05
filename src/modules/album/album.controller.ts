import {
  BadRequestException,
  Body, ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put, UseInterceptors
} from "@nestjs/common";
import { AlbumService } from './album.service';
import { validationID } from '../../utils/utils';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { AlbumEntity } from './entities/album.entity';

@Controller('album')
@UseInterceptors(ClassSerializerInterceptor)
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllAlbums(): AlbumEntity[] {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getAlbumById(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ): AlbumEntity {
    const album = this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() createAlbumDto: CreateAlbumDto): AlbumEntity {

    return this.albumService.createAlbum(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateAlbumInfo(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
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
  deleteAlbum(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ) {
    const album = this.albumService.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return this.albumService.deleteAlbum(id);
  }
}
