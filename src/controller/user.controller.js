import { asyncHandler, asyncHandlerTC } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadInCludinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
  // console.log(req.body);
  // validate those fields
  if (!(username || email)) {
    throw new apiError(400, "Email or password is required");
  }
  //from the basis of username or email find the user
  const user = await User.findOne({
    $or: [{ username }, { email }], //fixed issue with email not password
  });
  console.log(user);
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

//We need a controller for accessToken when accessToken expire we need to regenerate it
const refreshAccessToken = asyncHandler(async (req, res) => {
  //get the refreshToken from cookie or from the req.body
  const incomeingRefreshToken =
    req.cookie?.refreshToken || req.body.refreshToken;
  //if not get the token -> throw an error
  if (!incomeingRefreshToken) {
    throw new apiError(401, "Unauthorized request");
  }
  try {
    //we need to decode the token with help of jwt so that we get the acctual token not the encrypted one
    const decoded = jwt.verify(
      incomeingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    //from the decoded refreshToken  we get the _id and with help of id we get the user
    const user = await User.findById(decoded?._id);
    //if no user found -> throw an error
    if (!user) {
      throw new apiError(404, "User not found");
    }
    //To know expiry of the refreshToken we need to compare the user refresh token with the geting token from req
    //if both are not same then -> throw an error
    if (incomeingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Token is expired");
    }

    //generate new tokens
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user?._id);

    //create a option for passing into cookie
    const options = {
      secure: true,
      httpOnly: true,
    };
    //generate a new token with help of a function and extract the newly created token
    //return the response with help of status and cookie for the token and a apiReponse in json
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            accessToken, //It is good practice to send token to user or frontend so that user can save it indivisually
            refreshToken: newRefreshToken,
          },
          "Access token Refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh Token");
  }
});

//controller for change in password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  //get the new and old password from req.body
  const { oldPassword, newPassword } = req.body;
  //req.user give us the user from the auth middleware from that user _id
  //find the user
  const user = await User.findById(req.user?._id);
  //from the user call the isPasswordCorrect method and compare with the old password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  //if it is not correct then throw -> error
  if (!isPasswordCorrect) {
    throw new apiError(401, "Invalid password");
  }
  //if correct then save the new password into the password filed of database user
  user.password = newPassword;
  //before save the model automatically hash the new password and also set validate Befor save to false so that all field need not to be update
  await user.save({ validateBeforeSave: false });
  //return the response that the password is changed
  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

//Get the current user and send it to the frontend
const getCurrentUser = asyncHandler(async (req, res) => {
  //just return the user geting from the req.user
  return res
    .status(200)
    .json(new apiResponse(201, req.user, "Current user fetched successfully"));
});

//update user account for specific fields like fullName, email, etc.
const updateUserAccount = asyncHandler(async (req, res) => {
  //get the nessecerry field from the req.body
  const { fullname, email } = req.body;
  //chech for the field for empty
  if (!fullname || !email) {
    throw new apiError(400, "All fields are required");
  }
  //call the findByIdAndUpdate method from the req.user.id and update the neccessery field
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true } //it is used to return the data after the update
  ).select("-password"); //select the password to filter it from the user

  //return the user in the response
  return res
    .status(200)
    .json(new apiResponse(200, user, "Account updated successfully"));
});

//Update the user avatar controller
const updateUserAvatar = asyncHandler(async (req, res) => {
  //get the avatar from req.file
  // console.log(req.file?.path);
  const avatarLocalPath = req.file?.path;
  //if the avatar is not get then throw -> error
  if (!avatarLocalPath) {
    throw new apiError(404, "avatar local path not found");
  }
  // console.log(avatarLocalPath);
  //store that avatar file into cloudinary and get the url
  const avatar = await uploadInCludinary(avatarLocalPath);
  // console.log(avatar);
  //if no url then throw -> error
  if (!avatar?.url) {
    throw new apiError(400, "avatar failed to upload into cloudinary");
  }
  //get the user with id and update and set the avatar with the cloudinary url
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar?.url,
      },
    },
    { new: true }
  ).select("-password");
  //return the response with the new user
  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar successfully updated"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverLocalPath = req.file?.path;
  if (!coverLocalPath) {
    throw new apiError(400, "CoverImage path is mission");
  }
  const coverImage = await uploadInCludinary(coverLocalPath);

  if (!coverImage?.url) {
    throw new apiError(400, "Error in uploading coverImage");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage?.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "CoverImage update successfully"));
});

//Function to get User channel profile
const getUserChannelProfile = asyncHandler(async (req, res) => {
  //first get the username from the req params
  const { username } = req.params;
  //if no username then throw -> erro
  if (!username?.trim()) {
    throw new apiError(400, "username is missing");
  }

  //use aggrigation pipeline for the User
  const channel = await User.aggregate([
    //first stage match the username to filter the users by the username
    {
      $match: { username: username?.toLowerCase() },
    },
    //second stage lookup to join from subscriptions, localfield is _id, foreign field is channel and add as subscriber
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    //thired stage lookup to join from subscriptions, localfield is _id, foreign field is subscriber and add as subscribeTo
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribeTo",
      },
    },
    //addfields like subscriberCount, channelSubscriberToCount and isSubscribed
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        channelSubscriberToCount: {
          $size: "subscribeTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    //select nesseccary field to return useing project and select the desired fields
    {
      $project: {
        username: 1,
        email: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        subscriberCount: 1,
        channelSubscriberToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  //Its a good practice to log the channel to know what datatpes and data will return by pipeline
  // console.log(channel)

  //if the return channel array not have any data then
  if (!channel?.length) {
    throw new apiError(400, "Channel does not exists");
  }

  //return the res with the channel data
  return res
    .status(200)
    .json(new apiResponse(200, channel[0], "User fetched successfully")); //channel[0] return only first object of channel
});

//Fuction to get the watchHistory
const getUserWatchHistory = asyncHandler(async (req, res) => {
  //get the user and filter the user by useing aggrigation pipeline

  const user = await User.aggregate([
    //first pipeline -> get the specific user by useing match the _id
    //Imp point in pipeline we cannot get the _id in string to do that we use mongoose .Type.ObjectId(<id fetch from the req.user>)
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      //2nd pipeline -> lookup from videos and localField-> watchHistory for..Fie -> _id as watchHistory
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        //use nested pipeline to get the owner field from the videos
        pipeline: [
          //nested pipeline -> use lookup from user and localField-> owner for..Fie -> _id as owner
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              //use nested pipeline to filter the owner with required fields
              //nested pipeline -> use project and select only fullname, username, avatar, etc otherwise owner has all fields of user which is unnessary
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          //use pipeline addFields to add as owner and filter out the first document of owner geting from last pipeline
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  //return the watchHistory from the first user return by the pipeline
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAccount,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
};
