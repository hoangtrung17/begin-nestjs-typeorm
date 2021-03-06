import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';
import {AuthUserDto} from './dto/auth-user.dto'
import {CreateUserDto} from '../users/dto/create-user.dto'
import { User} from '../users/users.model'

export enum Provider {
  GOOGLE = 'google'
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (user.password === pass)) {
      return user;
    }
    return null;
  }

  async login(userInfo) {
    const payload = { username: userInfo.username, sub: userInfo.email };
    return {
      ...payload,
      access_token: this.jwtService.sign(payload)
    };
  }

  async validateOAuthLogin(thirdPartyId: string, provider: Provider): Promise<string> {
    try {
      const payload = {
        thirdPartyId,
        provider
      }

      const jwt: string = sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
      return jwt;
    }
    catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }
}