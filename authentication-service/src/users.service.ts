import {Injectable, HttpService} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './user.entity';
import {generate, verify} from 'password-hash';
import {sign} from 'jsonwebtoken';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private httpService: HttpService
    ) {
    }

    async register(name: string, email: string, pass: string, address: string, bootstrapColor: string, ): Promise<any> {
        let user = await this.usersRepository.findOne({email});
        if (!user) {
            user = await this.usersRepository.create({
                name, email,
                password: generate(pass),
                address, "bootstrap_color": bootstrapColor
            });
            await this.usersRepository.save(user);
            let {password, ...result}: any = user;
            //user service create http call
            try {
                const results = await this.httpService.post(`${process.env.AUTH_WEBSERVER_URL}/users/add`, {
                    id: user.id.toString(), name, email, address, bootstrapColor
                }).toPromise();
                if(results.status !== 200){
                    await this.usersRepository.delete(user);
                    return {errors:['create user failed']};
                }
            }catch (e) {
                await this.usersRepository.delete(user);
                return {errors:['couldn\'t create user']};
            }
            //kong http call, for secure api_gateway requests
            // creating kong consumer
            try {
                const results = await this.httpService.post(`${process.env.AUTH_GATEWAY_URL}/consumers`, {
                    username: user.name, custom_id: user.id.toString()
                }).toPromise();
                if(results.status !== 201){
                    await this.usersRepository.delete(user);
                    await this.httpService.post(`${process.env.AUTH_WEBSERVER_URL}/users/delete`, {email: user.email}).toPromise();
                    return {errors:['create user consumer failed']};
                }
            }catch (e) {
                await this.usersRepository.delete(user);
                await this.httpService.post(`${process.env.AUTH_WEBSERVER_URL}/users/delete`, {email: user.email}).toPromise();
                return {errors:['couldn\'t create user consumer']};
            }
            //creating kong consumer jwt token
            let token: string;
            try {
                const results: any = await this.httpService.post(`${process.env.AUTH_GATEWAY_URL}/consumers/${user.name}/jwt`).toPromise();
                token = sign({iss: results.data.key}, results.data.secret, {algorithm: results.data.algorithm, expiresIn: 60 * 60 * 2});
            }catch (e) {
                return {errors:['couldn\'t create user jwt']};
            }
            result.token = token;
            return result;
        }
        return {errors:['User exists']};
    }

    async login(email: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findOne({email});
        if(!user) {
            return {errors: ['User not found']};
        }
        if (verify(pass, user.password)) {
            const {password, ...result}: any = user;
            //creating kong consumer jwt token
            let token: string;
            try {
                const results: any = await this.httpService.post(`${process.env.AUTH_GATEWAY_URL}/consumers/${user.name}/jwt`).toPromise();
                token = sign({iss: results.data.key}, results.data.secret, {algorithm: results.data.algorithm, expiresIn: 60 * 60 * 2});
            }catch (e) {
                return {errors:['couldn\'t create user jwt']};
            }
            result.token = token;
            return result;
        }else {
            return {errors: ['wrong password']};
        }
    }
}