import { Document } from "mongoose";

export interface IUser extends Document {
	fullname: string;
	email: string;
	password: string;
	passwordConfirm: string;
	username: string;
	role: string;
	address: string;
	phoneNumber: string;
	createdAt: Date;
	updatedAt: Date;
}
