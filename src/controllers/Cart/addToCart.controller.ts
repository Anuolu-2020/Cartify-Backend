import { Request, Response, NextFunction } from "express";

import ProductModel from "../../models/product.model";
import CartModel from "../../models/cart.model";

import { errorHandler } from "../../utils/error.handler.class";
import { validateAddToCart } from "../../utils/validateUserInput";
import { IUser } from "../../models/user.interface";

const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  //Validate request body
  const { error } = validateAddToCart(req.body);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return next(new errorHandler(400, errorMessage));
  }

  try {
    const { productId, quantity } = req.body;

    //Get user from request object
    const user = req.user as IUser;

    //Get user id
    const userId = user._id;

    const product = await ProductModel.findOne({ _id: productId });

    if (!product) {
      return next(new errorHandler(404, "Product not found"));
    }

    //Calculate product total price
    const productPrice = product.price * quantity;

    //Check if user already has a cart
    let cart = await CartModel.findOne({ userId });

    //User already as a cart
    if (cart) {
      //Get index of product in the cart
      const itemIndex = cart.products.findIndex(
        (p) => p.productId == productId,
      );

      //Product already exists
      if (itemIndex > -1) {
        const productItem = cart.products[itemIndex];

        productItem.quantity = quantity;

        productItem.price = productPrice;

        //Get total price of all products
        cart.totalPrice = cart.products
          .map((item) => item.price)
          .reduce((acc, next) => acc + next);
      } else {
        //Add new product to cart
        cart.products.push({
          productId,
          name: product.name,
          price: productPrice,
          quantity,
        });

        //Get total price of all products
        cart.totalPrice = cart.products
          .map((item) => item.price)
          .reduce((acc, next) => acc + next);
      }

      //Save the cart
      cart = await cart.save();

      res.status(200).json(cart);
    } else {
      //User doesn't have a cart, Create a new cart
      const newCart = await new CartModel({
        userId,
        products: [
          { productId, name: product.name, price: productPrice, quantity },
        ],
        totalPrice: productPrice,
      }).save();

      res.status(201).json(newCart);
    }
  } catch (err) {
    return next(err);
  }
};

export = addToCart;
