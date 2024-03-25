import passport from "passport";
import dotenv from "dotenv";

import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-custom";
import { OAuth2Client } from "google-auth-library";

//Google client id
const client = new OAuth2Client();

import { isValidPassword, userModel } from "../models/user.model";
import { IUser } from "../models/user.interface";

class AuthenticationStrategy {
  constructor() {
    dotenv.config();
    this.serializeUser();
    this.deserializeUser();
    this.google();
    this.passwordSignIn();
    this.passwordSignUp();
  }

  // SERIALIZE USERS
  serializeUser() {
    passport.serializeUser(function(user: IUser, done) {
      done(null, user);
    });
  }

  // DESERIALIZE USERS
  deserializeUser() {
    passport.deserializeUser(function(user: IUser, done) {
      done(null, user);
    });
  }

  google() {
    passport.use(
      "google",
      new GoogleStrategy(async (request, done) => {
        //Get response object from request object
        const res = request.res;

        try {
          const { token } = request.body;

          console.log(token);

          const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
          });

          const { sub, name, email } = ticket.getPayload();

          console.log("The profile is:", sub);

          // If an email was not returned by Google
          if (!email) {
            return res.status(500).json({
              success: false,
              message: "Internal server error, email not returned by Google.",
            });
          }

          const user = await userModel.findOne({ email });

          //If a user already exists
          if (user) {
            // Remove password from output
            user.password = undefined;

            //Sign user in
            return done(null, user);
          }

          //create a new user
          const newUser = {
            fullname: name,
            email: email,
            password: sub,
            passwordConfirm: sub,
            username: name,
          };

          //Save user to DB
          const savedUser = await new userModel(newUser).save();

          // Remove password from output
          savedUser.password = undefined;

          console.log("user signed in with google");

          return done(null, savedUser);
        } catch (err) {
          console.log(err);
          return res.status(500).json({
            success: false,
            message: "An error occurred while signing user in",
          });
        }
      }),
    );
  }

  passwordSignUp() {
    passport.use(
      "signUp",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        async (req, email, password, done) => {
          try {
            //Get response object from request body
            const res = req.res;

            const { fullname, passwordConfirm } = req.body;

            //Check if user exists
            const userExist = await userModel.exists({ email });

            if (userExist) {
              //Respond with
              return res
                .status(401)
                .json({ status: false, message: "User Already Exists" });
            }

            //If password doesn't match
            if (password !== passwordConfirm) {
              return res
                .status(401)
                .json({ status: false, message: "Password not the same" });
            }

            //Construct user data
            const newUser = { fullname, email, password, passwordConfirm };

            //Save user to db
            const savedUser = await new userModel(newUser).save();

            // Remove password from output
            savedUser.password = undefined;

            console.log("user signed up");

            return done(null, savedUser);
          } catch (err) {
            //Get response object from request body
            const res = req.res;
            console.log(err);

            res.status(500).json({
              status: false,
              message: "An error occurred while trying to register user",
            });
          }
        },
      ),
    );
  }

  passwordSignIn() {
    passport.use(
      "signIn",
      new LocalStrategy(
        {
          usernameField: "email",
          passwordField: "password",
          passReqToCallback: true,
        },
        async (req, email, password, done) => {
          try {
            //Get response object from request body
            const res = req.res;

            //Check if user exists and include password with it
            const user = await userModel.findOne({ email }).select("+password");

            //If user doesn't
            if (!user) {
              //Respond with
              return res
                .status(404)
                .json({ status: false, message: "User Not Found" });
            }

            //validate password
            const validate = await isValidPassword(password, user.password);

           
            if (!validate) {
              return res
                .status(401)
                .json({ status: false, message: "Wrong Email or Password" });
            }

            // Remove password from output
            user.password = undefined;

            console.log("User signed in");

            console.log(user);

            return done(null, user);
          } catch (err) {
            //Get response object from request body
            const res = req.res;

            console.log(err);
            res.status(500).json({
              status: false,
              message: "An error occurred while trying to register user",
            });
          }
        },
      ),
    );
  }
}

export = AuthenticationStrategy;
