import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
    getH(): string {
        return 'Hello Service Hello';
    }
}
