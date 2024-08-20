import { NextFunction, Request, Response } from "express";
import crypto from "crypto";

export const paymentWebhook = async (
	req: Request,
	res: Response,
	_: NextFunction,
) => {
	const secret = process.env.PAYSTACK_SECRET_KEY;

	const hash = crypto
		.createHmac("sha512", secret)
		.update(JSON.stringify(req.body))
		.digest("hex");

	if (hash == req.headers["x-paystack-signature"]) {
		// Retrieve the request's body
		const event = req.body;
		// Do something with event
		console.log(event);
	}
	res.send(200);
};
