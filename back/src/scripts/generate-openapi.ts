import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFileSync } from "fs";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = new DocumentBuilder().setTitle("My API").build();

	const document = SwaggerModule.createDocument(app, config);

	writeFileSync("../shared/openapi.json", JSON.stringify(document));

	SwaggerModule.setup("api", app, document);
}

bootstrap();
