import Joi from "joi";

import joiOptions from "../config/joi.config";
import { IUser } from "../models/user.interface";
import mongoose from "mongoose";

// VALIDATE USER INPUT FOR SIGN-UP
function validateSignUpInput(user: string) {
	// Validate user request inputs, min password length is 8
	const schema = Joi.object({
		fullname: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(30).required(),
		passwordConfirm: Joi.string().min(8).max(30).required(),
	});

	return schema.validate(user, joiOptions);
}

// VALIDATE USER INPUT FOR SIGN-IN
function validateEmailPasswordInput(user: string) {
	// Validate user request inputs, min password length is 8
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).max(30).required(),
	});

	return schema.validate(user, joiOptions);
}

// VALIDATE USER INPUT FOR SIGN-UP
function validateProductUpload(product: object) {
	// Validate user request inputs, min password length is 8
	const schema = Joi.object({
		productName: Joi.string().required(),
		productDetails: Joi.string().required(),
		productPrice: Joi.number().min(10).required(),
		category: Joi.string().valid(
			"Electronics & Gadgets",
			"Fashion & Apparel",
			"Health & Beauty",
			"Home & Kitchen",
			"Sports & Outdoors",
			"Toys & Games",
			"Books & Stationery",
		),
		units: Joi.number().min(1).required(),
	});

	return schema.validate(product, joiOptions);
}

// VALIDATE USER INPUT FOR SIGN-UP
function validateAddToCart(cart: string) {
	// Validate user request inputs, min password length is 8
	const schema = Joi.object({
		productId: Joi.string()
			.regex(/^[0-9a-fA-F]{24}$/)
			.message("must be an oid")
			.required(),
		quantity: Joi.number().min(1).required(),
	});

	return schema.validate(cart, joiOptions);
}

// VALIDATE USER ROLE UPDATE
function validateUserRoleUpdate(user: IUser) {
	const schema = Joi.object({
		address: Joi.string().min(8).required(),
		phoneNumber: Joi.string().min(11).max(14),
	});

	return schema.validate(user, joiOptions);
}

//Validate ids to delete products
function validateIds(ids: string[]) {
	const schema = Joi.object({
		productIds: Joi.array().required(),
	});

	return schema.validate(ids, joiOptions);
}
// .regex(/^[0-9a-fA-F]{24}$/, message)

function validateProductId(id: { type: mongoose.Types.ObjectId } | string) {
	const schema = Joi.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.message("must be an oid")
		.required();

	return schema.validate(id, joiOptions);
}

function validateUserId(id: { type: mongoose.Types.ObjectId } | string) {
	const schema = Joi.string()
		.regex(/^[0-9a-fA-F]{24}$/)
		.message("must be an oid")
		.required();

	return schema.validate(id, joiOptions);
}

function validateProductReview(review: object) {
	const schema = Joi.object({
		rating: Joi.number().min(0).max(5).required(),
		review: Joi.string().required(),
	});

	return schema.validate(review, joiOptions);
}

export {
	validateEmailPasswordInput,
	validateSignUpInput,
	validateProductUpload,
	validateAddToCart,
	validateUserRoleUpdate,
	validateIds,
	validateProductId,
	validateProductReview,
	validateUserId,
};
