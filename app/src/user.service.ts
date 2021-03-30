import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { User } from './entities/user';

@Injectable()
export class UserService {
    private userRepository: Repository<User>;

    constructor
    (
        private connection: Connection
    ) {
        this.userRepository = this.connection.getRepository(User);
    }

    async getUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async getUserById(id: number): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    async deleteUserById(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }

    async updateUser(id: number, newUser: Partial<User>): Promise<void> {
        await this.userRepository.update(id, newUser)
    }

    async createUser(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
