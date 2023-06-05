import { Artist } from "../../artist/models/artist.interface";
import { Album } from "../../album/models/album.interface";
import { Track } from "../../track/models/track.interface";


export class FavouritesEntity {
  artists: Artist[] = [];
  albums: Album[] = [];
  tracks: Track[] = [];
}