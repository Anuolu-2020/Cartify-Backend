import { NextFunction, Request, Response } from "express";

export const checkApiVersion = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { version } = req.params;

	if (version !== "1") {
		res.status(404).json({
			message: `Undefined API version accessed.`,
			success: false,
		});
	}
	next();
};
