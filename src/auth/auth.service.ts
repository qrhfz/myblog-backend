import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    if (
      process.env.ADMIN_USERNAME === username &&
      process.env.ADMIN_PASSWORD === pass
    ) {
      console.log('login as ' + username);
      return { username: process.env.ADMIN_USERNAME };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username };

    return this.jwtService.sign(payload);
  }
}
