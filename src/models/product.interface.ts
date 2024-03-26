import mongoose, { Document } from "mongoose";

export interface IProducts extends Document {
  vendorId: {
    ref: string;
    type: mongoose.Types.ObjectId;
  };
  name: string;
  photo: string;
  productDetails: string;
  category: string;
  price: number;
  rating: number;
  vendorName: string;
  vendorAddress: string;
}
