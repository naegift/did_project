import { ApiProperty } from '@nestjs/swagger';

export class ResUploadImage {
  @ApiProperty({ example: 'http://example.com' })
  link: string;
}
