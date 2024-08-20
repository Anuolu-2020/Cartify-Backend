import { IOrder } from "../models/order.interface";

export abstract class PaymentGateway {
	async processPayment(order: IOrder) {}
}

export class PaystackGateway implements PaymentGateway {
	private async initializeTransaction(order: IOrder) {
		const params = {
			email: order.email,
			amount: order.grandTotal,
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

			const data = await response.json();
			console.log(data);
			return data;
		} catch (error) {
			console.error("Error:", error);
		}
	}

	async processPayment(order: IOrder) {
		const payload = await this.initializeTransaction(order);
	}
}

export enum PAYMENT_METHOD {
	PAYSTACK = "paystack",
}
