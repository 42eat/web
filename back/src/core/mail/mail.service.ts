import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { env } from "../env";
import { WinstonLoggerService } from "../logging/logger.service";
import { LogBuilder } from "../logging/log-builder";

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly logger: WinstonLoggerService,
	) {}

	async sendEmail(
		emailsList: string[],
		subject: string,
		template: string,
		context: ISendMailOptions["context"],
	) {
		try {
			const sendMailParams: ISendMailOptions = {
				to: emailsList,
				subject: subject,
				template: template,
				context: context,
				headers: {
					"List-Unsubscribe": `<mailto:${env.SMTP_USER}?subject=unsubscribe>`,
					"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
					"X-Mailer": "42eat",
					"X-Priority": "3",
					"X-MSMail-Priority": "Normal",
					"Content-Type": "text/html; charset=UTF-8",
				},
			};
			await this.mailerService.sendMail(sendMailParams);
			this.logger.log(LogBuilder.mail.send(emailsList, template));
		} catch (_e) {
			this.logger.error(LogBuilder.error("SEND_EMAIL", "Failed to send the email"));
			throw new InternalServerErrorException(
				"An error occurred while sending the email",
			);
		}
	}
}
