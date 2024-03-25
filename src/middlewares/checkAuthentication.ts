import { Request, Response, NextFunction } from "express";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res
      .status(401)
      .json({ message: "Unauthorized request made to this endpoint." });
  }

  next();
};

export = isAuthenticated;
