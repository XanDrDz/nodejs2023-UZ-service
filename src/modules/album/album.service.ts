import { Injectable, NotFoundException } from "@nestjs/common";
import { DbService } from '../../db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { Album } from './models/album.interface';
import { CreateAlbumDto } from './dto/album.dto';
import { TrackService } from '../track/track.service';
import { FavoriteService } from '../favorite/favorite.service';
import { AlbumEntity } from './entities/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class AlbumService {
  constructor(
    private db: DbService,
    private trackService: TrackService,
    private favoriteService: FavoriteService,
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  getAllAlbums() {
    return this.albumRepository.find();
  }

  async getAlbumById(id) {
    const options: FindOneOptions<AlbumEntity> = {
      where: { id },
    };
    return await this.albumRepository.findOne(options);
  }

  async updateAlbum(id, data) {
    const album = await this.getAlbumById(id);
    album.artistId = data.artistId;
    album.name = data.name;
    album.year = data.year;
    return this.albumRepository.save(album);
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    const album = new AlbumEntity();
    album.name = createAlbumDto.name;
    album.year = createAlbumDto.year;
    album.artistId = createAlbumDto.artistId;
    album.id = uuidv4();


    return await this.albumRepository.save(album);
  }

  async deleteAlbum(id) {
    const album = await this.getAlbumById(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    await this.trackService.removeAlbumId(id);

    return await this.albumRepository.delete(id);
  }

  async removeArtistId(id: string) {
    const albums = await this.albumRepository.find({ where: { artistId: id } });
    for (const album of albums) {
      album.artistId = null;
      await this.albumRepository.save(album);
    }
  }
}
