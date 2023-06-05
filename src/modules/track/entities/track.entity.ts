export class TrackEntity {
  readonly id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}