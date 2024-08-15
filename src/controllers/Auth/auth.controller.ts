import dotenv from "dotenv";
import { AuthenticationStrategy } from "../../Auth/authentication";
import { NextFunction, Request, Response } from "express";

dotenv.config();

//passport authentication strategies
const authService = new AuthenticationStrategy();

//Controller for google signup/signIn route
async function handleGoogle(req: Request, res: Response, next: NextFunction) {
	const user = await authService.google(req, res, next);

	res.status(200).json({
		success: true,
		message: "Successfully signed in with Google.",
		payload: { user },
	});
}

// HANDLE SIGN OUT
function handleSignOut(req: Request, res: Response) {
	req.session.destroy(function (err) {
		if (err) {
			console.error(err);
			return res.status(500).json({
				message: "Internal server error, unable to sign user out.",
				success: false,
			});
		}
	});

	res.clearCookie("connect.sid");
	res
		.status(200)
		.json({ success: true, message: "User Signed out successfully" });
}

export { handleGoogle, handleSignOut };
