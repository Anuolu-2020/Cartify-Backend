import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/pasetoToken";
import { errorHandler } from "../utils/error.handler.class";
import { UserPayload } from "../types/user";

export const isAuthenticated = async (
	req: Request,
	_: Response,
	next: NextFunction,
) => {
	const header = req.headers["authorization"];

	if (!header) {
		return next(
			new errorHandler(401, "Unauthorized request made to this endpoint"),
		);
	}

	const [authType, token] = header.split(" ");

	if (authType != "Bearer" || !token) {
		return next(new errorHandler(401, "Invalid authorization format"));
	}

	const payload = await verifyToken(token, next);

	if (!payload) {
		return;
	}

	req["user"] = payload as UserPayload;

	next();
};
//
