import { Response } from "express";
import { IOrder } from "../models/order.interface";
import { PAYMENT_METHOD, PaymentGateway } from "./payment.gateway";

export class PaymentService {
	private paymentGateways: Record<string, PaymentGateway> = {};

	public registerGateway(
		paymentMethod: PAYMENT_METHOD,
		paymentGateway: PaymentGateway,
	) {
		this.paymentGateways[paymentMethod] = paymentGateway;
	}

	public async processPayment(
		order: IOrder,
		paymentMethod: PAYMENT_METHOD,
		res: Response,
	) {
		const gateway = this.paymentGateways[paymentMethod];

		if (gateway) {
			await gateway.processPayment(order, res);
		} else {
			throw new Error("Payment method not supported");
		}
	}
}
