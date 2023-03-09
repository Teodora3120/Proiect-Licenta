import { Injectable, HttpException, HttpStatus } from
    '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id }
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async register(credentials: User): Promise<User> {
        return await this.userRepository.save(credentials);
    }

    async update(id: string, user: User): Promise<void> {
        await this.userRepository.update(id, user);
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async login(credentials: { email: string; password: string; }): Promise<string> {
        console.log(credentials)
        return credentials.email;
    }
}
