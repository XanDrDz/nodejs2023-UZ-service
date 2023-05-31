import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';

@Injectable()
export class FavoriteService {
  constructor(private db: DbService) {}
}
