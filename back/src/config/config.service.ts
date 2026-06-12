import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";

@Injectable()
export class AppConfigService {
	constructor(private readonly prisma: PrismaService) {}

	// TODO: a remplacer par un cache redis ou delire du genre car la c'est pas propre
	private cache = new Map<string, string>();

	public async get(key: string): Promise<string | null> {
		if (this.cache.has(key)) return this.cache.get(key)!;

		const config = await this.prisma.appConfig.findUnique({ where: { key } });
		if (config) this.cache.set(key, config.value);
		return config?.value ?? null;
	}

	public async set(key: string, value: string) {
		await this.prisma.appConfig.upsert({
			where: { key },
			update: { value },
			create: { key, value },
		});
		this.cache.set(key, value);
	}

	public getVariables() {
		return this.prisma.appConfig.findMany();
	}

	public async editVariables(key: string, value: string) {
		const variable = await this.prisma.appConfig.findUnique({ where: { key } });
		if (!variable) {
			throw new NotFoundException("No existing variable with this key");
		}
		await this.prisma.appConfig.update({ where: { key }, data: { value } });
		return variable;
	}

}
