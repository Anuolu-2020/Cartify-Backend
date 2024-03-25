import express = require("express");

import { isRestrictedTo } from "../middlewares/roleAuth.middleware";

const userRoute = express.Router();

import {
  getUserData,
  createUser,
  deleteUsers,
  updateRole,
} from "../controllers/user.controller";

userRoute.route("/update-role").put(updateRole);

userRoute.use(isRestrictedTo("admin"));

userRoute.route("/").get(getUserData).post(createUser).delete(deleteUsers);

export { userRoute };
