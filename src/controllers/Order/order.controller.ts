import { Response, Request, NextFunction } from "express";
import { IUser } from "../../models/user.interface";
import { validateUserId } from "../../utils/validateUserInput";
import { errorHandler } from "../../utils/error.handler.class";

export const createOrder = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = req.user as IUser;

	const userId = user._id;

	const { error } = validateUserId(userId);
	if (error) {
		const errorMessage = error.details[0].message.replace(/"/g, "");
		return new errorHandler(400, errorMessage);
	}


};
