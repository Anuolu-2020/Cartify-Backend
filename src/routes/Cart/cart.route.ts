import express, { Router } from "express";
import addToCart from "../../controllers/Cart/addToCart.controller";
import { getCart } from "../../controllers/Cart/getCart.controller";
import removeFromCart from "../../controllers/Cart/removeFromCart.controller";

const router: Router = express.Router();

router.route("/addToCart").post(addToCart);
router.route("/getCart").get(getCart);
router.route("/remove/product/:productId").post(removeFromCart);

export { router };
