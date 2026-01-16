import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeService } from './me.service';
import { UserModule } from 'src/core/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
