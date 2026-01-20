import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/core/refresh-token/refresh-token.service';
import { UserService } from 'src/core/user/user.service';
import { generateCode } from 'src/func/generate-code';
import { generateOTP } from 'src/func/generate-opt';
import { nameFromEmail } from 'src/func/name-from-email';
import { RedisService } from 'src/lib/redis/redis.service';
import { ResendService } from 'src/lib/resend/resend.service';
import { EmailDto, VerifyDto } from 'src/types/email.types';
import { ResponseDataType } from 'src/types/response.type';

@Injectable()
export class EmailService {
  constructor(
    private readonly userService: UserService,
    private readonly sendEmail: ResendService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) { }

  async email(data: EmailDto): Promise<ResponseDataType> {
    const otp = generateOTP();

    const emailSendSuccess = await this.sendEmail.sendEmail({
      email: data.email,
      name: nameFromEmail(data.email),
      otp,
    });

    if (!emailSendSuccess) {
      throw new ServiceUnavailableException(
        'Failed to send email, Please try again later',
      );
    }

    const redisSetSuccess = await this.redisService.set(
      `otp:${data.email}`,
      otp,
      300,
    );

    if (!redisSetSuccess) {
      throw new ServiceUnavailableException(
        'Failed to set OTP, Please try again later',
      );
    }

    return {
      message: 'OTP has been sent to your email',
      email: data?.email,
    };
  }

  async verify(data: VerifyDto): Promise<ResponseDataType> {
    const redisGetOtp = await this.redisService.get(`otp:${data.email}`);

    if (!redisGetOtp) {
      throw new BadRequestException('Expired OTP or incorrect');
    }

    if (redisGetOtp !== data.otp) {
      throw new BadRequestException('Incorrect or expired OTP');
    }

    this.redisService.del(`otp:${data.email}`);

    const user = await this.userService.upsert({
      email: data.email,
      name: nameFromEmail(data.email),
    });

    if (!user) {
      throw new ServiceUnavailableException(
        'Failed to register email, Please try again later',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
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
      `code:${code}`,
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

    return {
      message: 'Otp verifyed successfully',
      code,
    };
  }
}
