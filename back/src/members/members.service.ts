import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Member } from "../generated/prisma/client";
import { PrismaService } from "../core/prisma/prisma.service";
import { equal } from "assert";

@Injectable()
export class MembersService {
	constructor(private readonly prisma: PrismaService) {}

	public async getAll(): Promise<Member[]> {
		return (await this.prisma.member.findMany()).map((m) => m);
	}

	public async getByEmail(email: string): Promise<Member | null> {
		return this.prisma.member.findUnique({ where: { email: email } });
	}

	public async getById(id: number): Promise<Member> {
		const member = await this.prisma.member.findUnique({ where: { id: id } });
		if (!member) {
			throw new InternalServerErrorException("Cannot load the user profile");
		}
		return member;
	}

	public async create(email: string, password: string): Promise<Member | null> {
		return this.prisma.member.create({ data: { email, password } });
	}
}
