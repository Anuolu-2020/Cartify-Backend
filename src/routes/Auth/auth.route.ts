import express, { Router } from "express";

// Importing the controller functions
import {
	handleSignOut,
	handleGoogle,
} from "../../controllers/Auth/auth.controller";

export const authRoute: Router = express.Router();

// HANDLE GOOGLE SIGN-UP/SIGN-IN REQUESTS
authRoute.route("/google").post(handleGoogle);

// HANDLE SIGN-OUT REQUEST
authRoute.route("/sign-out").post(handleSignOut);
