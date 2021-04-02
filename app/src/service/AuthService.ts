import { Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {
    }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.getUserByUserName(username);
        if (user.password === password) {
            return user;
        }

        return null;
    }
}
