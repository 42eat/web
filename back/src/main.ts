import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	const config = new DocumentBuilder().setTitle("My API").build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, document);

	await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
