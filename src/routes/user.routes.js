import { Router } from "express";

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { varifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

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

//route for logout the user with help of logout controller with a post method and also add a middleware varifyJWT befor the controller
router.route("/logout").post(varifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken)

export default router;
