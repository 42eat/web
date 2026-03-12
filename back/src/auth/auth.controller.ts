import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Member } from '../generated/prisma/client';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express'
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken } = await this.authService.register(dto);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: false, // todo: passer en true quand on aura le https
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		})

		return { accessToken };

	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken } = await this.authService.login(dto);

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			secure: false, // todo: passer en true quand on aura le https
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000
		})

		return { accessToken };

	}

}
