import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PhoneDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}

export class PhoneVerifyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
