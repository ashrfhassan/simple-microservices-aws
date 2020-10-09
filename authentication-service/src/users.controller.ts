import { Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async register(@Req() req: Request) {
        return await this.usersService.register(req.body.name, req.body.email, req.body.password, req.body.address, req.body.bootstrapColor);
    }

    @Post('login')
    async login(@Req() req: Request) {
        return await this.usersService.login(req.body.email, req.body.password);
    }
}
