import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/core/user/user.service';
import { UserType } from 'src/types/user.types';

@Injectable()
export class MeService {
  constructor(private readonly userService: UserService) {}

  async me(userId: string): Promise<UserType> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
