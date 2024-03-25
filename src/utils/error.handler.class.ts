interface Ierrors {
  message: string[];
}

class errorHandler extends Error {
  public statusCode: number;
  public success: boolean;
  public isOperational?: boolean;
  public path: string;
  public value: string;
  public message: string;
  public errors: Ierrors;
  public errmsg: string;
  public code: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode >= 400 ? false : true;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { errorHandler };
