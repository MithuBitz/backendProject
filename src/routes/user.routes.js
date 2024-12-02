import { Router } from "express";

import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getUserWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAccount,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { varifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Unsecure Routes
//use upload middleware so that the file are access in the routes
router.route("/register").post(
  //Use the middlware befor the controller of the route
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

//Route for login the user with help of loginUser controller with a post method
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secure Routes
//below routes are like secure route bcoz these routes need a user already loggedin
//route for logout the user with help of logout controller with a post method and also add a middleware varifyJWT befor the controller
router.route("/logout").post(varifyJWT, logoutUser);

router.route("/change-password").post(varifyJWT, changeCurrentPassword);
router.route("/current-user").get(varifyJWT, getCurrentUser);

router.route("/update-account").patch(varifyJWT, updateUserAccount);
router
  .route("/avatar")
  .patch(varifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/coverImage")
  .patch(varifyJWT, upload.single("coverImage"), updateUserCoverImage);

// "/c/" represent the channel
router.route("/c/:username").get(varifyJWT, getUserChannelProfile);
router.route("/history").get(varifyJWT, getUserWatchHistory);

export default router;
