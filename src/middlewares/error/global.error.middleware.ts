import { errorHandler } from "../../utils/error.handler.class";
import { NextFunction, Request, Response } from "express";

// Handle db cast errors
function handleCastErrorDB(err: errorHandler) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new errorHandler(400, message);
}

// Handle db duplicate fields
function duplicateFieldDB(err: errorHandler) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new errorHandler(400, message);
}

// Handle db validation errors
function handleValidationErrorDB(err: errorHandler) {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new errorHandler(400, message);
}

// Send errors during development
function sendDevErrors(err: errorHandler, _: Request, res: Response) {
  return res.status(err.statusCode || 500).json({
    success: err.success,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

// Send errors during production
function sendProdErrors(err: errorHandler, req: Request, res: Response) {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: err.success,
        message: err.message,
      });
    }
  }
  // 1) Log error
  console.error("AN ERROR OCCURRED", err),
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
}

// GLOBAL ERROR HANDLING MIDDLEWARE
const globalErrorMiddleware = (
  err: errorHandler,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction,
) => {
  if (process.env.NODE_ENV === "development") {
    sendDevErrors(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = duplicateFieldDB(error);

    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    sendProdErrors(error, req, res);
  }
};

export { globalErrorMiddleware };
