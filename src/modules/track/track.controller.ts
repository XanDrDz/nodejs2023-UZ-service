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
import { TrackService } from './track.service';
import { isValidUUID } from '../../utils/utils';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { isRequestInvalid } from './helpers/track-body-checker';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllTracks() {
    this.trackService.getAllTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTrackById(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto || isRequestInvalid(createTrackDto)) {
      throw new BadRequestException('Additional data required');
    }

    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateTrackInfo(
    @Body() updateTrackDto: UpdateTrackDto,
    @Param('id') id: string,
  ) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    track.name = updateTrackDto.name;
    track.albumId = updateTrackDto.albumId;
    track.artistId = updateTrackDto.artistId;
    track.duration = updateTrackDto.duration;

    return track;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid ID');
    }
    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    this.trackService.deleteTrack(id);
  }
}
