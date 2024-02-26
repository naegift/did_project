import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVcDto {
  @IsString()
  credential: string;
}
