import express from "express";

import { isRestrictedTo } from "../middlewares/roleAuth.middleware";

const userRoute = express.Router();

import {
	getUserData,
	createUser,
	deleteUsers,
	updateRole,
} from "../controllers/user.controller";
import { checkout } from "../controllers/checkout.controller";

userRoute.route("/update-role").put(updateRole);
userRoute.route("/checkout").get(checkout);

userRoute.use(isRestrictedTo("admin"));

userRoute.route("/").get(getUserData).post(createUser).delete(deleteUsers);

export { userRoute };
