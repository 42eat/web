import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { MailController } from "./mail.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { join } from "path";

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					host: process.env.SMTP_HOST,
					port: +(process.env.SMTP_PORT ?? 465),
					secure: true,
					tls: {
						rejectUnauthorized: false,
					},
					auth: {
						user: process.env.SMTP_USER,
						pass: process.env.SMTP_PASS,
					},
				},
				defaults: {
					from: process.env.SMTP_USER,
				},
				template: {
					dir: join(process.cwd(), "dist", "core", "mail", "templates"),
					adapter: new HandlebarsAdapter(),
					options: {
						strict: true,
					},
				},
				preview: process.env.NODE_ENV !== "production",
			}),
		}),
	],
	providers: [MailService],
	controllers: [MailController],
	exports: [MailService],
})
export class MailModule {}
