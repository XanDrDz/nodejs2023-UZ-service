import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class TrackService {
  constructor(private db: DbService) {}
}
