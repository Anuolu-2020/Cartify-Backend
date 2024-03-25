import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user.model";
import { errorHandler } from "../utils/error.handler.class";
import { validateUserRoleUpdate } from "../utils/validateUserInput";
import { IUser } from "../models/user.interface";

const getUserData = async (_: Request, res: Response) => {
  try {
    const userData = await userModel.find({});

    res.status(200).json({
      status: true,
      message: "Successfully fetched users data",
      data: userData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "An error occurred while fetching users",
    });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      res
        .status(400)
        .json({ status: false, message: "No email or password provided" });
    }

    const newUser = new userModel({ email, password });

    await newUser.save();

    res.status(201).json({
      status: true,
      message: "Successfully created user",
      data: newUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "An error ocurred while creating the user",
    });
  }
};

//WARNING: WILL CLEAR ALL THE DATA IN THE DATABASE
const deleteUsers = async (_: Request, res: Response) => {
  try {
    await userModel.deleteMany({});

    res.status(200).json({
      status: true,
      message: "Successfully cleared the db",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: "An error ocurred while deleting users",
    });
  }
};

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateUserRoleUpdate(req.body);

  if (error) {
    const errorMessage = error.details[0].message.replace(/"/g, ""); // strip out quotes
    return next(new errorHandler(400, errorMessage));
  }

  try {
    const { address, phoneNumber } = req.body;

    const user = req.user as IUser;

    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      { role: "vendor", address, phoneNumber, updatedAt: Date.now() },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return next(new errorHandler(404, "user to be updated doesn't exist"));
    }

    // req.session?.user = updatedUser;

    res.status(200).json({
      success: true,
      message: "updated user role successfully",
      payload: { updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

export { getUserData, createUser, deleteUsers, updateRole };
