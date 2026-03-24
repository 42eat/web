import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendEmail(params: {
		subject: string;
		template: string;
		context: ISendMailOptions["context"];
	}) {
		try {
			const emailsList: string[] = [
				// "lilefebv@student.42lyon.fr",
				// "ehosta@student.42lyon.fr",
				// "ebini@student.42lyon.fr",
				// "ethebaul@student.42lyon.fr",
				// "ticasali@student.42lyon.fr",
			];

			const sendMailParams = {
				to: emailsList,
				from: "test@42eat.fr",
				subject: params.subject,
				template: params.template,
				context: params.context,
			};
			await this.mailerService.sendMail(sendMailParams);
		} catch (error) {
			console.error(
				`Error while sending mail : ${JSON.stringify(params)}`,
				error,
			);
		}
	}
}
