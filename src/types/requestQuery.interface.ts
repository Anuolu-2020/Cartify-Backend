import mongoose from "mongoose";

type productParams = {
	productId: { type: mongoose.Types.ObjectId } | string;
	productIds: string[];
};

type ReqBodyProduct = {
	productIds: string[];
};

//type ResBody = object;
//type ReqBody = object;
type ReqQuery = {
	fields: string;
	page: string;
	limit: string;
};

export { productParams, ReqQuery, ReqBodyProduct };
