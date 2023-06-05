import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== null)
  albumId: string | null;

  @IsNumber()
  duration: number;
}

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== null)
  artistId: string | null;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((_, value) => value !== null)
  albumId: string | null;

  @IsNumber()
  duration: number;
}