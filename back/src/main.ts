import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { appContract } from "@42eat-web/shared";
import { SwaggerModule } from "@nestjs/swagger";
import { generateOpenApi } from "@ts-rest/open-api";
import cookieParser from "cookie-parser";
import { TsRestValidationFilter } from "./core/filters/ts-rest-validation.filter";
import { NestExpressApplication } from "@nestjs/platform-express";
import { env } from "./core/env";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.set("trust proxy", 1);

	app.use(cookieParser());
	app.useGlobalFilters(new TsRestValidationFilter());

	if (env.NODE_ENV === "dev") {
		const document = generateOpenApi(appContract, {
			info: {
				title: "42eat API",
				version: "1.0.0",
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
			security: [{ bearerAuth: [] }],
		});
		SwaggerModule.setup("api", app, document);
	}

	await app.listen(env.PORT ?? 3001);
}

bootstrap().catch((e) => console.error(e));
