import { Controller, Get, Post, Req, UseGuards, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local.auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.login(req.user);
    res.cookie('token', token, { httpOnly: true });
    return res.send({ token: token });
  }
}
