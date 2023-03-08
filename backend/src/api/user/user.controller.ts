import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './user.interface';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post("/register")
    async register(@Body() user) {
        this.userService.register(user);
    }

    @Post("/login")
    async login(@Body() credentials: { email: string; password: string; }) {
        this.userService.login(credentials);
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: IUser) {
        this.userService.update(id, user);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        this.userService.delete(id);
    }
}
