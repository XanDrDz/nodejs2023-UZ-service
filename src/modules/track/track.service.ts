import { Injectable, NotFoundException } from "@nestjs/common";
import { DbService } from "../../db/db.service";
import { Track } from "./models/track.interface";
import { v4 as uuidv4 } from "uuid";
import { CreateTrackDto } from "./dto/track.dto";
import { FavoriteService } from "../favorite/favorite.service";
import { TrackEntity } from "./entities/track.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TrackService {
  constructor(
    private db: DbService,
    private favoriteService: FavoriteService,
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>
  ) {
  }

  async getAllTracks() {
    return await this.trackRepository.find();
  }

  async getTrackById(id: string) {
    const track = await this.trackRepository.findOne({ where: { id } });
    return track ?? null;
  }

  async createTrack(createTrackDto: CreateTrackDto) {
    const track = new TrackEntity();
    track.id = uuidv4();
    track.albumId = createTrackDto.albumId;
    track.duration = createTrackDto.duration;
    track.name = createTrackDto.name;
    track.artistId = createTrackDto.artistId;
    return await this.trackRepository.save(track);
  }

  async deleteTrack(id: string) {
    const track = await this.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    this.favoriteService.removeTrack(id, true);

    return await this.trackRepository.delete(id);
  }

  async removeArtistId(id) {
    const tracks = await this.trackRepository.find({ where: { artistId: id } });
    for (const track of tracks) {
      track.artistId = null;
      await this.trackRepository.save(track);
    }
  }

  async updateTrack(id, data) {
    const track = await this.getTrackById(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    await this.trackRepository.update(id, data);
    const updatedTrack = await this.getTrackById(id);
    return updatedTrack;
  }

  async removeAlbumId(id: string): Promise<void> {
    const tracks = await this.trackRepository.find({ where: { albumId: id } });
    for (const track of tracks) {
      track.albumId = null;
      await this.trackRepository.save(track);
    }
  }
}
