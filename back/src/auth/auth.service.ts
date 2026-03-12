import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Member } from '../generated/prisma/client';
import { MembersService } from '../members/members.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { SessionsService } from 'src/sessions/sessions.service';

@Injectable()
export class AuthService {
	constructor(private readonly members: MembersService, private readonly sessions: SessionsService, private readonly jwtService: JwtService) {}

	public async register(dto: RegisterDto) {
		
		const existing = await this.members.getByEmail(dto.email);

		if (existing) {
			throw new ConflictException(["Email alredy used"]);
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10);

		const insertedUser = await this.members.create(dto.email, hashedPassword);

		if (!insertedUser) {
			throw new InternalServerErrorException(["An error occured while creating the user"]);
		}

		return {
			accessToken: await this.generateAccessToken(insertedUser.id),
			refreshToken: await this.generateRefreshToken(insertedUser.id),
		}
	}

	public async login(dto: LoginDto) {
		
		const existing = await this.members.getByEmail(dto.email);

		if (!existing || !existing.password) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const isValidPassword = await bcrypt.compare(dto.password, existing.password);

		if (!isValidPassword) {
			throw new UnauthorizedException(["Invalid credentials"]);
		}

		return {
			accessToken: "Y'a pas encore",
			refreshToken: "y'a pas non plus"
		}
	}

	private async generateAccessToken(userId: number) {
		return this.jwtService.signAsync(
			{ sub: userId },
			{ secret: process.env.JWT_SECRET, expiresIn: '15m' }
		)
	}

	private async generateRefreshToken(userId: number) {

		const token = await this.jwtService.signAsync(
			{ sub: userId },
			{ secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
		);
		const hashedToken = await bcrypt.hash(token, 10);
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		if(!await this.sessions.create()) {
			throw new InternalServerErrorException(["An error occured while creating the session"]);
		}

		return token;
	}

}