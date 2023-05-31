import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class ArtistService {
  constructor(private db: DbService) {}
}
