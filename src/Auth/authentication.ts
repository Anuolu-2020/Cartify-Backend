//import passport from "passport";
import dotenv from "dotenv";

import { OAuth2Client } from "google-auth-library";

//Google client id
const client = new OAuth2Client();

import { userModel } from "../models/user.model";
//import { IUser } from "../models/user.interface";
import { GoogleOauthBody } from "./interface/googleOauth.interface";
import { NextFunction, Request, Response } from "express";
import { signToken } from "../utils/pasetoToken";
import { EmailService } from "../email/email.service";

export class AuthenticationStrategy {
	constructor(private readonly emailService: EmailService) {
		dotenv.config();
	}

	async google(req: Request, res: Response, next: NextFunction) {
		try {
			const { token } = req.body as GoogleOauthBody;

			//console.log(token);

			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: process.env.CLIENT_ID,
			});

			const tokenPayload = ticket.getPayload();

			//console.log("The profile is:", tokenPayload?.sub);

			// If an email was not returned by Google
			if (!tokenPayload?.email) {
				return res.status(500).json({
					success: false,
					message: "Internal server error, email not returned by Google.",
				});
			}

			const userEmail = tokenPayload.email;

			const user = await userModel.findOne({ email: userEmail });

			//If a user already exists
			if (user) {
				const userObj = user.toObject();

				// Remove password from output
				delete userObj.password;

				//Sign token
				const accesstoken = await signToken(
					{ _id: user._id, role: user.role },
					next,
				);

				//Sign user in
				return { ...userObj, accesstoken };
			}

			//create a new user
			const newUser = {
				fullname: tokenPayload.name,
				email: tokenPayload.email,
				password: tokenPayload.sub,
				passwordConfirm: tokenPayload.sub,
				username: tokenPayload.name,
			};

			//Save user to DB
			const savedUser = await new userModel(newUser).save();

			const userObj = savedUser.toObject();

			// Remove password from output
			delete userObj.password;

			//Sign token
			const accesstoken = await signToken({ _id: savedUser._id }, next);

			console.log("user signed in with google");

			await this.emailService.sendWelcomeMail(
				savedUser.email,
				savedUser.username,
			);

			return { ...userObj, accesstoken };
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				success: false,
				message: "An error occurred while signing user in",
			});
		}
	}
}
