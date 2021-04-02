import {
    ArgumentMetadata,
    Body, CallHandler, CanActivate,
    Controller, createParamDecorator,
    Delete, ExecutionContext,
    Get,
    HttpException,
    HttpStatus, Injectable, NestInterceptor,
    Param, ParseArrayPipe, ParseIntPipe, PipeTransform,
    Post,
    Put,
    Request,
    Res, UseGuards, UseInterceptors
} from '@nestjs/common';
import { AppService } from './app.service';
import { HelloService } from './hello.service';
import { UserNotFoundError, UserService } from './user.service';
import { Connection } from 'typeorm';
import { User } from './entities/user';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthGuard } from '@nestjs/passport';

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
class AuthGuardMy implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return context.switchToHttp().getRequest().headers.authorization === 'Basic login:password';
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

@Injectable()
class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        console.log('logging request before');
        return next.handle().pipe(
            tap(() => {
                console.log('after request');
            })
        );
    }

}

@Injectable()
class TransformUserIdToUserInterceptor implements NestInterceptor {
    private userRepository: Repository<User>;

    constructor
    (
        private connection: Connection
    ) {
        this.userRepository = this.connection.getRepository(User);
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map(val => {
            return this.userRepository.findOne(val);
        }));
    }
}

const AuthDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization || null;
    return token;
});

@Controller('/')
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly helloService: HelloService,
        private readonly userService: UserService,
    ) {
    }

    @Post('auth/login')
    @UseGuards(AuthGuard('local'))
    async login(@Request() req: any) {
        return req.user;
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
    @UseInterceptors(LoggingInterceptor, TransformUserIdToUserInterceptor)
    async getUserById(@Request() req: any, @Param('id', ParseIntPipe) id: User, @AuthDecorator() token: string): Promise<any> {
        const token2 = req.headers.authorization;
        console.log(token2, token);
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
