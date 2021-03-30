import { Body, Controller, Get, Param, Post, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { HelloService } from './hello.service';
import { UserService } from './user.service';

@Controller('/app')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly helloService: HelloService,
        private readonly userService: UserService
    ) {
    }

    @Get()
    getHello(@Request() req: any, @Res() resp: any): string {
        return this.appService.getHello();
    }

    @Get('/users/:id')
    getUsers(@Param('id') id: number): any {
        return this.userService.getUsers();
    }

    @Get('/user-create')
    createUser(): any {
        return this.userService.createUser({
            id: 2,
            name: "ivan"
        });
    }

    @Get('/hello')
    getHelloPath(): string {
        return this.helloService.getH();
    }
}
