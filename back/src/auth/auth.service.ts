import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Member } from '../generated/prisma/client';
import { MembersService } from '../members/members.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(private readonly members: MembersService) {}

	public async register(dto: RegisterDto) {
		
		const existing = await this.members.getByEmail(dto.email);

		if (existing) {
			throw new ConflictException(["Email alredy used"]);
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10);

		this.members.create(dto.email, hashedPassword)

		return {
			accessToken: "Y'a pas encore",
			refreshToken: "y'a pas non plus"
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

}