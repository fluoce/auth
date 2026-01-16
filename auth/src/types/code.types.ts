import { IsNotEmpty, IsString } from 'class-validator';

export class CodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export type CodeDataType = {
  refreshToken: string;
  accessToken: string;
};
