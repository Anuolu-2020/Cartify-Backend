import { NextFunction } from "express";
import { V4 } from "paseto";
import { errorHandler } from "./error.handler.class";
import { UserPayload } from "../types/user";

const { sign, verify } = V4;

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function signToken(payload: any, next: NextFunction) {
	try {
		const token = await sign(
			payload,
			process.env.PASETO_PRIVATE_KEY as string,
			{
				expiresIn: "2 hours",
			},
		);

		return token;
	} catch (err) {
		console.log(err);
		return next(new errorHandler(500, "An Error Occurred"));
	}
}

export async function verifyToken(
	token: string,
	next: NextFunction,
): Promise<UserPayload | null> {
	try {
		const payload = (await verify(
			token,
			process.env.PASETO_PUBLIC_KEY as string,
		)) as UserPayload;

		return payload;
	} catch (err) {
		next(new errorHandler(401, "Token invalid or expired"));
		return;
	}
}
