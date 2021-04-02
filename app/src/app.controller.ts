import {
    ArgumentMetadata,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus, Injectable,
    Param, ParseArrayPipe, ParseIntPipe, PipeTransform,
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
import { Repository } from 'typeorm';

@Injectable()
class ValidateUserIdPipe implements PipeTransform {
    private userRepository: Repository<User>;

    constructor
    (
        private connection: Connection
    ) {
        this.userRepository = this.connection.getRepository(User);
    }

    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const user = await this.userRepository.findOne(value);
        if (!user) {
            throw new HttpException('Wrong user id', HttpStatus.BAD_REQUEST);
        }
        console.log(user);

        return value;
    }
}

@Injectable()
class ExtractUserByIdPipe implements PipeTransform {
    private userRepository: Repository<User>;

    constructor
    (
        private connection: Connection
    ) {
        this.userRepository = this.connection.getRepository(User);
    }

    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const user = await this.userRepository.findOne(value);
        if (!user) {
            throw new HttpException('Wrong user id', HttpStatus.BAD_REQUEST);
        }
        return user;
    }
}

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
    async getUserById(@Param('id', ParseIntPipe, ExtractUserByIdPipe) id: User): Promise<any> {
        return id;
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
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        }
    }

    @Get('/hello')
    getHelloPath(): string {
        return this.helloService.getH();
    }
}
