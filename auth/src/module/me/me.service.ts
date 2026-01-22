import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/core/user/user.service';
import { RedisService } from 'src/lib/redis/redis.service';
import { UserType } from 'src/types/user.types';

@Injectable()
export class MeService {
  constructor(private readonly userService: UserService, private readonly redisService: RedisService) { }

  async me(userId: string): Promise<UserType> {

    let user = await this.redisService.get(`me:${userId}`)

    if (!user) {
      user = await this.userService.findById(userId);

      if (!user) {
        throw new NotFoundException('user not found');
      }

      this.redisService.set(`me:${userId}`, user, 60 * 5).catch(() => { })
    }


    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
