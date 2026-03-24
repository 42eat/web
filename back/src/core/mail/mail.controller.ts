import { Controller, Get } from "@nestjs/common";
import { MailService } from "./mail.service";

@Controller("mail")
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@Get()
	async sendMail() {
		await this.mailService.sendEmail({
			subject: "Banger on peut envoyer des mail",
			template: "template",
			context: {
				name: "Fabrice",
			},
		});
		return { test: "test" };
	}
}
