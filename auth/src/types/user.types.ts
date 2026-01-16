import {
  IsEmail,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  photo?: string;
}

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  @IsString()
  photo?: string;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  photo?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
