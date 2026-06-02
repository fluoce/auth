import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { emailOtpKey, meKey, phoneOtpKey } from 'src/constant/redis-key';
import { UserService } from 'src/core/user/user.service';
import { RedisService } from 'src/lib/redis/redis.service';
import {
  AddEmailDto,
  AddPhoneDto,
  UpdateUserDto,
  UserType,
} from 'src/types/user.types';

@Injectable()
export class MeService {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  async me(userId: string): Promise<UserType> {
    let user = await this.redisService.get(meKey(userId));

    if (!user) {
      user = await this.userService.findById(userId);

      if (!user) {
        throw new NotFoundException('user not found');
      }

      this.redisService.set(meKey(userId), user, 60 * 5).catch(() => {});
    }

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async update(userId: string, data: UpdateUserDto): Promise<UserType> {
    const updateUser = await this.userService.update(userId, data);

    if (!updateUser) {
      throw new NotFoundException('user not found or update failed');
    }

    this.redisService.set(meKey(userId), updateUser, 60 * 5).catch(() => {});

    return updateUser;
  }

  async addEmail(userId: string, data: AddEmailDto): Promise<UserType> {
    const userPhoneExist = await this.userService.emailExist(data.email);

    if (userPhoneExist) {
      throw new BadRequestException('user with this email already exist');
    }

    const redisGetOtp = await this.redisService.get(emailOtpKey(data.email));

    if (!redisGetOtp) {
      throw new BadRequestException('Expired OTP or incorrect');
    }

    this.redisService.del(emailOtpKey(data.email));

    const user = await this.userService.addEmail(userId, data.email);

    if (!user) {
      throw new NotFoundException('User not found, or unable to add email');
    }

    return user;
  }

  async addPhone(userId: string, data: AddPhoneDto): Promise<UserType> {
    const userPhoneExist = await this.userService.phoneExist(data.phone);

    if (userPhoneExist) {
      throw new BadRequestException(
        'user with this phone number already exist',
      );
    }
    const redisGetOtp = await this.redisService.get(phoneOtpKey(data.phone));

    if (!redisGetOtp) {
      throw new BadRequestException('Expired OTP or incorrect');
    }

    this.redisService.del(phoneOtpKey(data.phone));

    const user = await this.userService.addPhone(userId, data.phone);

    if (!user) {
      throw new NotFoundException('User not found, or unable to add phone');
    }

    return user;
  }
}
