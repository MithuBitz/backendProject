import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadInCludinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

//Specific async method for generating access and refresh token with help of userId as a parameter
const generateAccessAndRefreshToken = async (userId) => {
  try {
    //in try block
    //find the user from db with help of the userId
    const user = await User.findById(userId);
    //from the user schema method generateAccessToken and hold it in a variable
    const accessToken = user.generateAccessToke();
    //from the user schema method generateRefreshToken and hold it in a variable
    const refreshToken = user.generateRefreshToken();
    //we need to store refreshToken in db
    user.refreshToken = refreshToken;
    //sava after store but false the validateBeforeSave so that need not to validate all field onto the db here
    await user.save({ validateBeforeSave: false });

    // return the accessToken and refreshToken for futher use
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(502, "Something went wrong in generating tokens");
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  //Get the required field like email or username and password from user to log in
  const { username, email, password } = req.body;
  // validate those fields
  if (!(username || email)) {
    throw new apiError(400, "Email or password is required");
  }
  //from the basis of username or email find the user
  const user = await User.findOne({
    $or: [{ username }, { password }],
  });
  //if user is not found then throw an error
  if (!user) {
    throw new apiError(404, "User not found");
  }
  //if user is found then check for password
  const isPasswordValid = await user.isPasswordCorrect(password);
  //if password is not match then throw an error
  if (!isPasswordValid) {
    throw new apiError(404, "Incorrect credentials");
  }
  //if password is match
  //generate access and refresh token for that user
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //options are used in cookie
  const options = {
    secure: true,
    httpOnly: true,
  };

  //send cookie to the user
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken, //It is good practice to send token to user or frontend so that user can save it indivisually
          refreshToken,
        },
        "User loggedIn successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //find the user with help of user id from access token
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      //update the user with refreshToken set to be undefined
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  //set option for clear cookie
  const options = {
    secure: true,
    httpOnly: true,
  };

  //return the response and clear the cookies
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"));
});

export { registerUser, loginUser, logoutUser };
