import Handlebars from "handlebars";
import { join } from "path";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import { promises as fs } from "fs";
import { orderEmailData } from "./templates-interface/interface";

export class EmailService {
	private async readAndCompileTemplate(file: string, data: any) {
		const htmlFilePath = join(__dirname, `templates//${file}`);

		const htmlFileContent = await fs.readFile(htmlFilePath, {
			encoding: "utf-8",
		});

		const htmlTemplate = Handlebars.compile(htmlFileContent);

		const html = htmlTemplate(data);

		return html;
	}

	private async sendEmail(
		email: string,
		html: any,
		subject: string,
		text?: string,
	) {
		const mailgun = new Mailgun(FormData);

		const key =
			process.env.NODE_ENV === "development"
				? process.env.TEST_MAILGUN_API_KEY
				: process.env.MAILGUN_API_KEY;

		const mg = mailgun.client({
			username: "api",
			key,
		});

		const domain =
			process.env.NODE_ENV === "development"
				? process.env.TEST_MAIL_DOMAIN
				: process.env.MAIL_DOMAIN;

		//Create and send messages with mailgun api
		mg.messages
			.create(domain, {
				from: `Cartify <${process.env.CARTIFY_MAIL}>`,
				to: email,
				subject,
				text,
				html,
			})
			.then((msg) => {
				console.log("Mail sent successfully");

				console.log(msg);
			})
			.catch((err) => {
				console.log("There was an error while sending mail");

				console.error(err);
			});
	}

	async sendWelcomeMail(email: string, username: string) {
		//compile templates
		const creds = {
			username,
		};

		//Read and compile the template
		const html = await this.readAndCompileTemplate("welcome.html", creds);

		await this.sendEmail(email, html, "Cartify Welcome Mail", undefined);
	}

	async sendSuccessfulOrderMail(email: string, data: orderEmailData) {
		const creds = {
			...data,
		};

		try {
			const html = await this.readAndCompileTemplate(
				"successful-order.html",
				creds,
			);

			await this.sendEmail(
				email,
				html,
				"Cartify Successfully Order Mail",
				undefined,
			);
		} catch (err) {
			console.error(err);
		}
	}
}
