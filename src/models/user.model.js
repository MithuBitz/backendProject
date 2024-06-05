import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: [6, "Password must have 6 charecter"],
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    requestToken: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

//We use a middleware with "pre" hook so that the data will be modified befor store into databasae
//We cannot use arrow function in callback bcoz in arrow funtion we dont deal with the schema property like "this.password" that why
//We use function(){} we also use async bcoz we use bcrypt and it takes time
userSchema.pre("save", async function (next) {
  //if password is not modified by user then no need to use bcrypt just return next()
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
});

//Use custom methods to run as a middleware by useing .methods
userSchema.methods.isPasswordCorrect = async function (password) {
  //compare the password given by user and the encrypted password stored in db
  return await bcrypt.compare(password, this.password);
};

//Create a method to generate a json web token
//Access token expiry is less then refresh token
//jwt.sign has three parmeters they are Data or payload, secret string and last the expiry time
userSchema.methods.generateAccessToke = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
