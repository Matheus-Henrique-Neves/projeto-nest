import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    const passSalted = user.email + '-' + password;
    if (user && bcrypt.compareSync(passSalted, user.password)) {
      return user;
    }

    return null;
  }
  async login(user: { email: string; id: number }) {
    const payload = {
      email: user.email,
      id: user.id,
    };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
