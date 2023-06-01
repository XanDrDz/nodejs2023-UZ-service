import { CreateTrackDto } from '../dto/track.dto';

export function isRequestInvalid(createTrackDto: CreateTrackDto) {
  return (
    !createTrackDto.name ||
    !createTrackDto.albumId ||
    !createTrackDto.artistId ||
    !createTrackDto.duration
  );
}