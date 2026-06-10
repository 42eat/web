import { Injectable } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { WinstonLoggerService } from "../core/logging/logger.service";

@Injectable()
export class FoyerService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly logger: WinstonLoggerService,
	) {}

}
