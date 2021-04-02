import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Request,
    Res
} from '@nestjs/common';
import { AppService } from './app.service';
import { HelloService } from './hello.service';
import { UserNotFoundError, UserService } from './user.service';
import { Connection } from 'typeorm';
import { User } from './entities/user';

@Controller('/')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly helloService: HelloService,
        private readonly userService: UserService,
    ) {
    }

    @Get()
    getHello(@Request() req: any, @Res() resp: any): string {
        return this.appService.getHello();
    }

    @Get('/users')
    async getUsers(@Param('id') id: number): Promise<any> {
        return this.userService.getUsers();
    }

    @Get('/users/:id')
    async getUserById(@Param('id') id: number): Promise<any> {
        return this.userService.getUserById(id);
    }

    @Put('/users/:id')
    async updateUserById(@Param('id') id: number, @Body() user: User): Promise<void> {
        return this.userService.updateUser(id, user);
    }

    @Delete('/users/:id')
    async deleteUserById(@Param('id') id: number): Promise<void> {
        this.userService.deleteUserById(id);
    }

    @Post('/users')
    async createUser(@Body() userData: User): Promise<User> {
        try {
            const userCreated = await this.userService.createUser(userData);
            return userCreated;
        } catch (e) {
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST)
        }
    }

    @Get('/hello')
    getHelloPath(): string {
        return this.helloService.getH();
    }
}
