import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param, ParseUUIDPipe,
  Post,
  Put
} from "@nestjs/common";
import { TrackService } from './track.service';
import { validationID } from '../../utils/utils';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { isRequestInvalid } from './helpers/track-body-checker';
import { TrackEntity } from "./entities/track.entity";

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getTrackById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): TrackEntity {
    validationID(id);
    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() createTrackDto: CreateTrackDto): TrackEntity {

    return this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updateTrackInfo(
    @Body() updateTrackDto: UpdateTrackDto,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    validationID(id);
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
  deleteTrack(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const track = this.trackService.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    this.trackService.deleteTrack(id);
  }
}
