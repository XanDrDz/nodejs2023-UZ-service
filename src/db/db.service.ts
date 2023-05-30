import { Injectable } from '@nestjs/common';
import { User } from "../modules/user/models/user.interface";
import { Artist } from "../modules/artist/models/artist.interface";
import { Track } from "../modules/track/models/track.interface";
import { Album } from "../modules/album/models/user.interface";
import { Favorites } from "../modules/favorite/models/favorite.interface";

@Injectable()
export class DbService {
  public users: User[] = [];
  public artists: Artist[] = [];
  public tracks: Track[] = [];
  public albums: Album[] = [];
  public favorites: Favorites[] = [];
}
