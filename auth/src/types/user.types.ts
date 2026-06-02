import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  IsPhoneNumber,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  photo?: string;
}

export class CreateUserWithPhoneDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  phone: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  photo?: string;
}

export class UpdateUserDto {
  @ValidateIf((o) => o?.photo === undefined)
  @IsString()
  name?: string;

  @ValidateIf((o) => o?.name === undefined)
  @IsOptional()
  @IsUrl()
  @IsString()
  photo?: string;
}

export class AddEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class AddPhoneDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export interface UserType {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
}
