import { Module, Global } from '@nestjs/common';
import { JwtService, JwtModule as NestJwtModule } from '@nestjs/jwt';
import { jwtPrivateKey, jwtPublicKey } from 'src/constant/jwt-key';
import type { StringValue } from 'ms';

@Global()
@Module({
  imports: [
    NestJwtModule.register({
      privateKey: jwtPrivateKey,
      publicKey: jwtPublicKey,
      signOptions: {
        algorithm: 'RS256',
        issuer: process.env.JWT_ISSUER!,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as StringValue,
      },
    }),
  ],
  exports: [NestJwtModule],
  providers: [JwtService],
})
export class JwtModule {}
