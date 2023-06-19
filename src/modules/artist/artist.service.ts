import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from './models/artist.interface';
import { CreateArtistDto } from './dto/artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';
import { ArtistEntity } from './entities/artist.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { AlbumEntity } from "../album/entities/album.entity";
import { DeleteResult, Repository } from "typeorm";

@Injectable()
export class ArtistService {
  constructor(
    private db: DbService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
    @Inject(forwardRef(() => FavoriteService))
    private favouritesService: FavoriteService,
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  getAllArtists() {
    return this.artistRepository.find();
  }

  async getArtistById(id: string) {
    const artist = await this.artistRepository.findOne({ where: { id } });
    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto) {
    const artist = new ArtistEntity();
    artist.id = uuidv4();
    artist.grammy = createArtistDto.grammy;
    artist.name = createArtistDto.name;
    return await this.artistRepository.save(artist);
  }

  async updateArtist(id, updateArtistDto) {
    const artist = await this.getArtistById(id);
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return await this.artistRepository.save(artist);
  }

  async deleteArtist(id: string) {
    // const artist = await this.getArtistById(id);
    await this.albumService.removeArtistId(id);
    await this.trackService.removeArtistId(id);
    await this.favouritesService.removeArtist(id, true);
    return await this.artistRepository.delete(id);
  }
}
