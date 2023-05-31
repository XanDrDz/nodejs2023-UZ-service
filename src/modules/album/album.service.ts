import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class AlbumService {
  constructor(private db: DbService) {}
}
