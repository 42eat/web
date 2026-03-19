import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { appContract } from '@42eat-web/shared'
import { SwaggerModule } from "@nestjs/swagger";
import { generateOpenApi } from '@ts-rest/open-api'
import cookieParser from "cookie-parser";
import { TsRestValidationFilter } from "./core/filters/ts-rest-validation.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.useGlobalFilters(new TsRestValidationFilter())

	const document = generateOpenApi(appContract, {
		info: {
			title: '42eat API',
			version: '1.0.0',
		},
	})
	SwaggerModule.setup('api', app, document)

	await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
