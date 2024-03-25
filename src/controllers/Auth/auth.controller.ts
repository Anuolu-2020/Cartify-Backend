import dotenv from "dotenv";
import passport from "passport";
import {
  validateEmailPasswordInput,
  validateSignUpInput,
} from "../../utils/validateUserInput";
import AuthenticationStrategy from "../../Auth/authentication";
import { Request, Response, NextFunction } from "express";

dotenv.config();

//passport authentication strategies
new AuthenticationStrategy();

//Controller for google signup/signIn route
function handleGoogle(req: Request, res: Response, next: NextFunction) {
  return passport.authenticate("google", {
    successRedirect: "google/redirect/success",
  })(req, res, next);
}

// controller for google redirect
function handleGoogleRedirect(req: Request, res: Response) {
  const { user } = req;

  res.status(200).json({
    success: true,
    message: "Successfully signed in with Google.",
    payload: { user },
  });
}

//Controller for signup route
function handlePasswordSignUp(req: Request, res: Response, next: NextFunction) {
  //Validate request body
  const { error } = validateSignUpInput(req.body);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }

  const redirectUrl = `${process.env.BASE_URL}/api/v1/auth/sign-up/redirect`;

  return passport.authenticate("signUp", {
    successRedirect: `${redirectUrl}/success`,
  })(req, res, next);
}

//Controller for signup redirect
function handlePasswordSignUpRedirect(req: Request, res: Response) {
  const { user } = req;

  res.status(201).json({
    message: "user registered  successfully",
    success: true,
    payload: { user },
  });
}

//Controller for signIn route
function handlePasswordSignIn(req: Request, res: Response, next: NextFunction) {
  //Validate request body
  const { error } = validateEmailPasswordInput(req.body);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }

  const redirectUrl = `${process.env.BASE_URL}/api/v1/auth/sign-in/redirect`;
  return passport.authenticate("signIn", {
    successRedirect: `${redirectUrl}/success`,
  })(req, res, next);
}

//Controller for signIn redirect
function handlePasswordSignInRedirect(req: Request, res: Response) {
  const { user } = req;

  res.status(200).json({
    message: "Signed in successfully",
    success: true,
    payload: { user },
  });
}

// HANDLE SIGN OUT
function handleSignOut(req: Request, res: Response) {
  req.session.destroy(function(err) {
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

export {
  handleGoogle,
  handleGoogleRedirect,
  handlePasswordSignUp,
  handlePasswordSignUpRedirect,
  handlePasswordSignIn,
  handlePasswordSignInRedirect,
  handleSignOut,
};
