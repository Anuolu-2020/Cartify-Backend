//import { Request } from "express";
import { Document } from "mongoose";

export interface IUser extends Document {
  //_id: string;
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
