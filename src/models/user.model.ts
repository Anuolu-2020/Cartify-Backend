import mongoose, { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { IUser } from "./user.interface";

const schema = mongoose.Schema;

const userSchema = new schema<IUser>({
  fullname: {
    type: String,
    required: [true, "Full name must be provided"],
  },
  email: {
    type: String,
    required: [true, "An Email must be provided"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A password must be provided"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
  username: {
    type: String,
    default: "Anonymous",
  },
  role: {
    type: String,
    enum: ["user", "vendor", "admin"],
    default: "user",
  },
  address: {
    type: String,
    default: "No Address",
  },
  phoneNumber: {
    type: String,
    default: "000",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

// HASH PASSWORDS, THEN STORE IN DB
userSchema.pre("save", async function(next) {
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});


//CHECK IF USER"S PASSWORD IS VALID
const isValidPassword = async (password: string, userPassword: string) => {
  const result = await bcrypt.compare(password, userPassword);

  return result;
};
const userModel: Model<IUser> = mongoose.model<IUser>("Users", userSchema);

export { userModel, isValidPassword };
