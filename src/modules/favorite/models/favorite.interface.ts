import { Artist } from "../../artist/models/artist.interface";
import { Album } from "../../album/models/album.interface";
import { Track } from "../../track/models/track.interface";

export interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface FavoritesResponse{
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}