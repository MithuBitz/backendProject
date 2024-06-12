import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//Use a middleware for cors porpose to encounter the cors error by declareing the origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//Create a middleware to limit the request body size
app.use(express.json({ limit: "16kb" }));
//Middleware for encodeing the url reuest string
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
//Create a middleware to store the static file inside the local database and folder name will be "public" or your choice
app.use(express.static("public"));
//Create a middleware to parse the cookie for use
app.use(cookieParser());

//imports for routes
import userRouter from "./routes/user.routes.js";

//use the routes
app.use("/api/v1/users", userRouter);

export { app };
