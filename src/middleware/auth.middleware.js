import jwt from "jsonwebtoken";

import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";

//Create a function with help of asyncHandler
//we create a middleware so we need req, res and also next to go to the next
export const varifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //Get the accessToken from the req cookies or if it was no cookie then
    const token =
      req.cookies?.accessToken ||
      //access the specific header called Authorization from the req
      //but the Authorization token are in the form of
      //Authorization: Bearer <token> so we need to replace the Bearer for geting only token
      req.header("Authorization")?.replace("Bearer ", "");

    //if token is not get then throw an error
    if (!token) {
      throw new apiError(404, "Access token not found");
    }
    //if token is there then varify that token with jwt with help of token and secrat token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //get an user useing that varify token and remove the password and refreshToken from the db response user
    const user = await User.findById(decodedToken?._id).select(
      "-refreshToken -password"
    );
    //if user is not geting useing that varfy token then throw an error
    if (!user) {
      throw new apiError(502, "Invalid access token ");
    }
    //if there is a user then hold this user into req.user
    req.user = user;
    //called the next()
    next();
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Access Token");
  }
});
