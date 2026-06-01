import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class EmailVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export type SendEmailType = {
  email: string;
  otp: string;
  name: string;
};
