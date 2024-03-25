import mongoose, { Document } from "mongoose";

export interface IProducts extends Document {
  vendorId: {
    ref: string;
    type: mongoose.Types.ObjectId;
  };
  name: string;
  photo: string;
  productDetails: string;
  price: number;
  vendorName: string;
  vendorAddress: string;
}
