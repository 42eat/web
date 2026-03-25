import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

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
					"List-Unsubscribe": `<mailto:${process.env.SMTP_USER}?subject=unsubscribe>`,
					"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
					"X-Mailer": "42eat",
					"X-Priority": "3",
					"X-MSMail-Priority": "Normal",
					"Content-Type": "text/html; charset=UTF-8",
				},
			};
			await this.mailerService.sendMail(sendMailParams);
		} catch (error) {
			console.error(error);
			throw new InternalServerErrorException(
				"An error occured while sending the email",
			);
		}
	}
}
