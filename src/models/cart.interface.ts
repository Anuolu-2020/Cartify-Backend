import mongoose, { Document } from "mongoose";

export interface ICart extends Document {
  userId: { type: mongoose.Types.ObjectId };
  products: [
    {
      productId: { type: mongoose.Types.ObjectId };
      quantity: number;
      name: string;
      price: number;
    },
  ];
  totalPrice: number;
}

export interface Item {
  productId: { type: mongoose.Types.ObjectId };
  quantity: number;
  name: string;
  price: number;
}
