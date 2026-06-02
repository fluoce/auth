import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { exCodeKey, phoneOtpKey } from 'src/constant/redis-key';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import { UserService } from 'src/core/user/user.service';
import { cookieOption } from 'src/func/cookie-option';
import { generateCode } from 'src/func/generate-code';
import { generateOTP } from 'src/func/generate-opt';
import { AuthCookieService } from 'src/lib/auth-cookie/auth-cookie.service';
import { RedisService } from 'src/lib/redis/redis.service';
import { TwilioService } from 'src/lib/twilio/twilio.service';
import { PhoneDto, PhoneVerifyDto } from 'src/types/phone.types';
import { ResponseDataType } from 'src/types/response.type';

@Injectable()
export class PhoneService {
  constructor(
    private readonly userService: UserService,
    private readonly sendSms: TwilioService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly authCookie: AuthCookieService,
  ) {}

  async phone(data: PhoneDto): Promise<ResponseDataType> {
    const otp = generateOTP();

    const smsSendSuccess = await this.sendSms.sendOtp(data.phone, otp);

    if (!smsSendSuccess) {
      throw new ServiceUnavailableException(
        'Failed to send sms, Please try again later',
      );
    }

    const redisSetSuccess = await this.redisService.set(
      phoneOtpKey(data.phone),
      otp,
      300,
    );

    if (!redisSetSuccess) {
      throw new ServiceUnavailableException(
        'Failed to set OTP, Please try again later',
      );
    }

    const userWithThisPhone = await this.userService.findByPhone(data.phone);

    return {
      message: 'OTP has been sent to your phone',
      phone: data.phone,
      isNewUser: !userWithThisPhone,
      name: userWithThisPhone ? userWithThisPhone?.name : undefined,
    };
  }

  async verify(
    data: PhoneVerifyDto,
    res: Response,
    authRt?: string,
  ): Promise<ResponseDataType> {
    const redisGetOtp = await this.redisService.get(phoneOtpKey(data.phone));

    if (!redisGetOtp) {
      throw new BadRequestException('Expired OTP or incorrect');
    }

    if (redisGetOtp !== data.otp) {
      throw new BadRequestException('Incorrect or expired OTP');
    }

    this.redisService.del(phoneOtpKey(data.phone));

    const user = await this.userService.upsertWithPhone({
      phone: data.phone,
      name: data.name,
    });

    if (!user) {
      throw new ServiceUnavailableException(
        'Failed to register Phone, Please try again later',
      );
    }

    const payload = {
      sub: user.id,
      email: user?.email,
      phone: user?.phone,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.refreshTokenService.createRefreshToken(user.id),
    ]);

    if (!accessToken || !refreshToken) {
      throw new ServiceUnavailableException(
        'Failed to create session, please try again later',
      );
    }

    const code = generateCode();

    const redisSetSuccess = await this.redisService.set(
      exCodeKey(code),
      {
        accessToken,
        refreshToken,
      },
      120,
    );

    if (!redisSetSuccess) {
      throw new ServiceUnavailableException(
        'Failed to create session, please try again later',
      );
    }

    await this.authCookie.setIfNotAuthRt(res, authRt, user?.id);

    return {
      message: 'Otp verifyed successfully',
      code,
    };
  }
}
