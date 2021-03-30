import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from './entities/user';

type UserModel = { id: number, name: string };

@Injectable()
export class UserService {
    constructor
    (
        private connection: Connection
    ) {

    }

    private users: UserModel[] = [
        {
            id: 1,
            name: 'anton'
        }
    ];

    async getUsers(): Promise<UserModel[]> {
        const repository = this.connection.getRepository(User);
        return await repository.find();
    }

    createUser(user: UserModel): UserModel {
        this.users.push(user);
        return user;
    }
}
