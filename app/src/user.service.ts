import { Injectable } from '@nestjs/common';

type UserModel = { id: number, name: string };

@Injectable()
export class UserService {
    private users: UserModel[] = [
        {
            id: 1,
            name: 'anton'
        }
    ];

    getUsers(): UserModel[] {
        return this.users;
    }

    createUser(user: UserModel): UserModel {
        this.users.push(user);
        return user;
    }
}
