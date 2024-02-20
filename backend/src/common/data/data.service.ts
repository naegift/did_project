import { Injectable } from '@nestjs/common';
import { ResPagination } from './dto/res-pagination.dto';

@Injectable()
export class DataService {
  pagination<T>(
    findAndCount: [T[], number],
    take: number,
    skip: number,
    page: number,
  ): ResPagination<T> {
    const array = findAndCount[0];
    const arrayCount = findAndCount[1];
    const nextPage = skip + take < arrayCount && page + 1;

    return { array, arrayCount, nextPage };
  }
}
