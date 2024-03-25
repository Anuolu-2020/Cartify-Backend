import express, { Router } from "express";

// Importing the controller functions
import {
  getAllProducts,
  getProduct,
} from "../../controllers/Products/getProducts.controller";

const router: Router = express.Router();

router.route("/").get(getAllProducts);
router.route("/:productId").get(getProduct);

export { router };
