import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User]), HttpModule],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}