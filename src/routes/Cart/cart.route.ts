import express, { Router } from "express";
import addToCart from "../../controllers/Cart/addToCart.controller";
import { getCart } from "../../controllers/Cart/getCart.controller";
import removeFromCart from "../../controllers/Cart/removeFromCart.controller";

const router: Router = express.Router();

router.route("/").post(addToCart);
router.route("/").get(getCart);
router.route("/:productId").delete(removeFromCart);

export { router };
