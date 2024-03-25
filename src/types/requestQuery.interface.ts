import mongoose from "mongoose";

type productParams = {
  productId: { type: mongoose.Types.ObjectId };
  productIds: string[];
};
//type ResBody = object;
//type ReqBody = object;
type ReqQuery = {
  fields: string;
};

export { productParams, ReqQuery };
