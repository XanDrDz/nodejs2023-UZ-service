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
import { ArtistService } from './artist.service';
import { validationID } from '../../utils/utils';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getArtistById(@Param('id') id: string) {
    validationID(id);
    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Body() createArtistDto: CreateArtistDto) {
    if (!createArtistDto || !createArtistDto.name || !createArtistDto.grammy) {
      throw new BadRequestException('Additional data required');
    }

    return this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateArtistInfo(
    @Body() updateArtistDto: UpdateArtistDto,
    @Param('id') id: string,
  ) {
    validationID(id);
    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    validationID(id);
    const artist = this.artistService.getArtistById(id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    this.artistService.deleteArtist(id);
  }
}
