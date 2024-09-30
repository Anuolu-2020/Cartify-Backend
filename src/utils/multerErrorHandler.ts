import { NextFunction, Request, Response } from "express";
import multer from "multer";

// Middleware to handle Multer errors
export const handleMulterError = (
	err: any,
	_: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({
				success: false,
				message: "File is too large. Max size is 1MB.",
			});
		}

		if (err.code === "LIMIT_UNEXPECTED_FILE") {
			return res.status(400).json({
				success: false,
				message: "Files more than maximum of 3 files allowed",
			});
		}

		// Handle other Multer errors
		return res.status(400).json({
			success: false,
			message: err.message,
		});
	} else if (err) {
		// Handle other errors
		return res.status(400).json({
			success: false,
			message: err.message,
		});
	}
	next();
};
