import express, { Router } from "express";

// Importing the controller functions
import {
  handlePasswordSignUp,
  handlePasswordSignUpRedirect,
  handlePasswordSignInRedirect,
  handlePasswordSignIn,
  handleSignOut,
  handleGoogle,
  handleGoogleRedirect,
} from "../../controllers/Auth/auth.controller";

const authRoute: Router = express.Router();

// HANDLE GOOGLE SIGN-UP/SIGN-IN REQUESTS
authRoute.route("/google").post(handleGoogle);
authRoute.route("/google/redirect/success").get(handleGoogleRedirect);

// HANDLE SIGN-UP REQUESTS
authRoute.route("/sign-up").post(handlePasswordSignUp);
authRoute.route("/sign-up/redirect/success").get(handlePasswordSignUpRedirect);

// HANDLE SIGN-IN REQUESTS
authRoute.route("/sign-in").post(handlePasswordSignIn);
authRoute.route("/sign-in/redirect/success").get(handlePasswordSignInRedirect);

// HANDLE SIGN-OUT REQUEST
authRoute.route("/sign-out").post(handleSignOut);

export = authRoute;
