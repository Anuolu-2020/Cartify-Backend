import mongoose, { Document } from "mongoose";

export interface IReview extends Document {
  productId: {
    ref: string;
    type: mongoose.Types.ObjectId;
  };
  user: {
    ref: string;
    type: mongoose.Types.ObjectId;
  };
  rating: number;
  review: string;
  timestamp: Date;
}
