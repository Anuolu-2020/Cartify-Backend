import mongoose from "mongoose";
import { IProducts } from "./product.interface";

const Schema = mongoose.Schema;

const productSchema = new Schema<IProducts>({
  vendorId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: [true, "Vendor id not provided"],
  },
  name: {
    type: String,
    required: [true, "A product name must be provided"],
  },
  photo: {
    type: String,
    required: [true, "Product photo url must be provided"],
  },
  productDetails: {
    type: String,
    required: [true, "Product details muust be provided"],
  },
  price: {
    type: Number,
    default: 0,
  },
  vendorName: {
    type: String,
    required: [true, "A vendor name must be provided for the product"],
  },
  vendorAddress: {
    type: String,
    required: [true, "Vendor address must be provided"],
  },
});

const productModel = mongoose.model<IProducts>("Products", productSchema);

export = productModel;
