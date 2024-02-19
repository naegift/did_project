import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'React Dev Server(3000) sent a request to NestJS Server(4000).';
  }
}
