import { Request, Response } from "express";

const welcomeToApi = (req: Request, res: Response) => {
  const { version } = req.params;
  res.status(200).json({
    status: "success",
    message: `welcome to Afrique spark Api v${version}`,
  });
};

export = welcomeToApi;
