import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../utils/error.handler.class";
import { IUser } from "../models/user.interface";

// This middleware checks if the user has the required role to access a route
export const isRestrictedTo = (...roles: string[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    // Get the user from the request object
    const user = req.user as IUser;

    if (!roles.includes(user.role)) {
      return next(
        new errorHandler(403, "You don't have role access to this route"),
      );
    }
    next();
  };
};
