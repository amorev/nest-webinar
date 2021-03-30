import { Injectable } from '@nestjs/common';
import { HelloService } from './hello.service';

@Injectable()
export class AppService {
  constructor(private readonly hService: HelloService) {
  }
  getHello(): string {
    return this.hService.getH();
  }
}
