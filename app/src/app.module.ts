import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloService } from './hello.service';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './service/AuthService';
import { LocalStrategy } from './lib/auth/local';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5433,
            username: 'root',
            password: 'S3RooTPass123',
            database: 'webinar_3003',
            entities: [
                __dirname + '/entities/*.js'
            ],
            synchronize: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService, HelloService, UserService, AuthService, LocalStrategy],
    exports: [UserService]
})
export class AppModule {
}
