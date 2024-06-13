import { Router } from "express";

import { registerUser } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

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
      name: coverImage,
      maxCount: 1,
    },
  ]),
  registerUser
);

export default router;
