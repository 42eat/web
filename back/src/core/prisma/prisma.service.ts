import "dotenv/config";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { env } from "../env";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor() {
		super({
			adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
		});
	}

	async onModuleInit() {
		await this.$connect();
	}
}
