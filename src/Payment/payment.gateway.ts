import { Response } from "express";
import { IOrder } from "../models/order.interface";

export abstract class PaymentGateway {
	async processPayment(order: IOrder, res: Response) {}
}

export class PaystackGateway implements PaymentGateway {
	private async initializeTransaction(order: IOrder, res: Response) {
		const params = {
			email: order.email,
			amount: order.grandTotal * 100, //Multiply by 100 to convert amount n naira to kobo
			reference: order.paymentReferenceCode,
		};

		try {
			const response = await fetch(
				"https://api.paystack.co/transaction/initialize",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(params),
				},
			);

			const payload = await response.json();

			//const parsedPayload = JSON.parse(payload);

			console.log(payload["data"].authorization_url);
			// Redirect user to payment page
			res.redirect(payload["data"].authorization_url);
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async processPayment(order: IOrder, res: Response) {
		await this.initializeTransaction(order, res);
	}
}

export enum PAYMENT_METHOD {
	PAYSTACK = "paystack",
}
