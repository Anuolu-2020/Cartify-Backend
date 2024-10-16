import { Document, Query } from "mongoose";
import { ReqQuery } from "../types/requestQuery.interface";

class ApiFeatures<T extends Document> {
	public modelQuery: Query<T[], Document<unknown, unknown, T>, object>;
	public query: ReqQuery;

	constructor(
		modelQuery: Query<T[], Document<unknown, unknown, T>, object>,
		query: ReqQuery,
	) {
		this.modelQuery = modelQuery;

		this.query = query;
	}

	public limitFields() {
		if (this.query.fields) {
			const fields = this.query.fields.split(",").join(" ");
			this.modelQuery = this.modelQuery.select(fields);
		} else {
			this.modelQuery = this.modelQuery.select("-__v");
		}

		return this;
	}

	public paginate() {
		const page = parseInt(this.query.page) * 1 || 1;
		const limit = parseInt(this.query.limit) * 1 || 10;
		const skip = (page - 1) * limit;

		this.modelQuery = this.modelQuery.skip(skip).limit(limit);

		return this;
	}
}

export { ApiFeatures };
