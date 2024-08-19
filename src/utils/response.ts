import { Response } from "express";

export function sendResponse(
	res: Response,
	statusCode: number,
	msg: string,
	data: unknown,
) {
	res.status(statusCode).json({
		success: true,
		message: msg,
		payload: { data },
	});
}
