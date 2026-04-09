import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { join } from "path";
import { env } from "../env";

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					host: env.SMTP_HOST,
					port: env.SMTP_PORT,
					secure: true,
					tls: {
						rejectUnauthorized: true,
					},
					auth: {
						user: env.SMTP_USER,
						pass: env.SMTP_PASS,
					},
					pool: {
						maxConnections: 5,
						maxMessages: 100,
					},
				},
				defaults: {
					from: `42's Foyer <${env.SMTP_USER}>`,
				},
				template: {
					dir: join(__dirname, "templates"),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
				preview: env.NODE_ENV !== "prod",
			}),
		}),
	],
	providers: [MailService],
	controllers: [MailController],
	exports: [MailService],
})
export class MailModule {}
