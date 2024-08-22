import express, { Router } from "express";

import multer from "multer";

const router: Router = express.Router();

// Importing the controller functions
import { uploadProduct } from "../../controllers/Products/uploadProduct.controller";
import { getVendorProducts } from "../../controllers/Products/getProducts.controller";
import deleteVendorProducts from "../../controllers/Products/deleteProducts";
import { isRestrictedTo } from "../../middlewares/roleAuth.middleware";
import { getVendorOrders } from "../../controllers/vendor/getOrders.controller";
import { acceptOrder } from "../../controllers/vendor/acceptOrder.controller";

// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();

// Multer filter to check if the file is an image
const upload = multer({ storage: storage });

router.use(isRestrictedTo("vendor", "admin"));

router.route("/product").post(upload.single("productImage"), uploadProduct);

router.route("/products").get(getVendorProducts).delete(deleteVendorProducts);
router.route("/products/orders").get(getVendorOrders);
router.route("/products/orders/:orderId").post(acceptOrder);

export { router };
