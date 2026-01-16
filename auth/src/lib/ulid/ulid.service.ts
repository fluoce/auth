import { UserIdPrefix, RefreshTokenIdPrefix } from 'src/types/id.types';
import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

@Injectable()
export class UlidService {
  generateUserId(prefix: UserIdPrefix): string {
    return `${prefix}_${ulid()}`;
  }

  generateRefreshTokenId(prefix: RefreshTokenIdPrefix): string {
    return `${prefix}_${ulid()}`;
  }
}
