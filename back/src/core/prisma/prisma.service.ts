import "dotenv/config";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor() {
		super({
			adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
		} as any);
	}

	async onModuleInit() {
		await this.$connect();
	}
}
