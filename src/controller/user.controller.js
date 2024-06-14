import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadInCludinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //Steps or logic or algorithm for register a user

  //get the required field for createing  a user from the frontend
  const { username, email, password, fullname } = req.body;

  //validate the fields for emptyness
  if (
    //Its a best way to check many fields at the same time with help of some() and trim()
    [username, email, password, fullname].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "Required fields should not to be empty");
  }

  //check the user is already register with the username and email
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new apiError(409, "username and email already exist");
  }

  // console.log(req.files.avatar);
  //check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path; //get it from multer middleware

  //Check for coverImage otherwise it is undifined to store in db
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  //upload the images and avatar into cloudinary
  if (!avatarLocalPath) {
    throw new apiError(400, "avatar must required");
  }

  const avatar = await uploadInCludinary(avatarLocalPath);
  const coverImage = await uploadInCludinary(coverImageLocalPath);

  //Check for avatar becoz its a required filed for db
  if (!avatar) {
    throw new apiError(400, "avatar must required");
  }
  //create a user object to create a entry for db
  const user = await User.create({
    username: username.toLowerCase(),
    fullname,
    email,
    password,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
  });

  //remove the password and refresh token from the response given by db after creation
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //check for user creation
  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  //return the response
  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User created successfully"));
});

export { registerUser };
