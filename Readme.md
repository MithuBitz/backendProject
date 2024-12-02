# Its a complete backend playground for explore all features

=======

# Its a complete backend playground to explore all features

## step 1 setup the project for codeing

### Create some basic file structure like create controller, db, middleware, models, utils folders to organise the structure

### Install the prettier locally for the project so that all contributor can have same code structure and also create .prettierignore

### Install the nodemon

### Middleware : Middleware the main purpose of middleware is to handle the request before the controller and also to handle the response after the controller. Its like a filter to handle the request before the controller and also to handle the response after the controller. Moongoose provide some hooks like pre, post, save, remove, update so that we can use it in middleware. In pre hook we can use the middleware to handle the request just before the data store into the database and in post hook we can use the middleware to handle the response just after the data store into the database. There are many more hooks available in moongoose.

### Methods in schema : We can also define some methods or function inside the schema which can also be a part of the schema.

# Create a backend service similar to youtube project :

## Step 1 :

- Initialize the project with help of `npm init` or `npm init -y`
- set the enty point to `src/index.js`
- set the type to `module`

## Step 2 :

- Install some dev dependency like `nodemon` and `prettier`
- In prettier we need to create a .prettierrc file and add the config there so that all contributor can have same code structure, like `singleQuote: false` , `bracketSpacing: true`, `tabWidth: 2`, `trailingComma: 'es5'`.
- set some prettier ignore file to ignore the file like `.prettierignore`

## Step 3 :

- Create a src folder create some folder like `controller`, `middleware`, `models`, `utils`, `db` and `routes` useing mkdir command.
- Create some files like `index.js`, `app.js`, `db.js`, `constants.js`, `.env`, `.env.example` useing touch command.
- Create a `index.js` file inside the `db` folder for holding all database connections
- Create `comment.model.js`, `user.model.js`, `video.model.js`, `like.model.js`, `playlist.model.js`, `tweet.model.js` and `subscription.model.js` file inside the `models` folder useing touch command.

## Step 4:

- Install express and mongoose useing npm
- Just for testing run a console log inside the `index.js` file and run the file. To run it we need to add a `start` script in `package.json` file like `"start": "node index.js"`
- and also add a `dev` script in `package.json` file like `"dev": "nodemon src/index.js"`

## Step 5: Its a own step to setup the custom logger.

## Step 6:

- In `app.js` file we need to import express and then create a express app using `const app = express();` and then export the app like `export {app}`
- In `index.js` file we first import the expreess app and then run the app.listen using `app.listen( PORT, () => { console.log(`Server running on port: ${PORT}`); } );` by defineing the PORT in `.env` file and also inside the index file too. if we dont want to add .env here in this stage of developement.
- Now create .env file and add the PORT like `PORT=4000` and then install `dotenv` package to read the .env file. To full setup we need to import the dotenv inside the index file and then use `dotenv.config()` to read the .env file with help of path. and then set the port useing `process.env.PORT`
- In some time in older version dotenv is not working properly in nodemon so we need to install `nodemon -r dotenv/config`

## Step 7:

- To work with CORS we need to first install a `cors` package and then import the `cors` inside the app.js file and then use the cors middleware like `app.use(cors({origin: process.env.CORS_ORIGIN, credentials: true}))`. `CORS_ORIGIN` is a env variable defined in `.env` file. Inside the `CORS_ORIGIN` we need to add the origin of the front end application or `*` for any origin but it is not secure. We all add all origin inside a array.
- Now we can also use some express middeleware like `app.use(express.json({limit: "16kb"}))` and `app.use(express.urlencoded({extended: true, limit: "16kb"}))` and also `app.use(express.static("public"))` to parse the request body and url request string and also to store the static file inside the local database folder as `public`.

## Step 8:

- Now we need a database for us its mongodb and create a cluster and then manage network access and also database access from the cluster.
- For first we need to initalize and export a constant name for Database name like `const DB_NAME = "backendplay";`
- Now connecting to the database we need to import the mongoose and database constant name inside the `db/index.js` file
- Now create a async function to connect to the database where we use try/catch block. First inside the catch block log an error and also `process.exit(1)` to exit the process for failer or error.
- In try block await a mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) and then console log the connection instance and also log the connection host.
- We need to create a MONGODB_URI in `env` file with help of mongo db url. just copy and paste the url from mongodb in our case.
- Now hold the connection instance in a constant name like `const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);` and then log the connection instance like `console.log("MongoDB connected :: DB_HOST : ${connectionInstance.connection.host}` inside the try block.
- and we need to export the database connection function like `export default dbConnect;`

## Step 9:

- Now in `index.js` file from src folder we need to import the `dbConnect` function and then call the `dbConnect` function like `dbConnect().then( app.listen(process.env.PORT || 4000, () => { console.log(`Server running on port: ${process.env.PORT}`); } ));` and then chain the catch block like `.catch((e) => { console.log("DB conncection failed :: ", e); })`
- run the app to connect the database.

## Step 10:

- Now we need to create async handler to use as a utility to run any funtion in try catch block or promise with async/await.
- First create a `asyncHandler.js` file inside the `utils` folder.
- Then create a asyncHandler higher order function which means it accept another function as a parameter which is in this case `requestHandler` .
- In that function return that `requestHandler` with help of three parameters `req`, `res` and `next`.
- Then reslove a promise using `Promise.resolve(requestHandler(req, res, next))` and then catch the error using `.catch((e) => next(e));`
- Then export the asyncHandler function like `export default asyncHandler;`

## Step 11:

- Create a `apiResponse.js` file inside the `utils` folder to use as a utility to create a response object.
- For this we need a `apiResponse` class we need `data`, `message`, `statusCode` and `success` property and `constructor` function to initialize the class and set the property value.
- Then export the `apiResponse` class like `export default apiResponse;`

## Step 12:

- Create a `apiError.js` file inside the `utils` folder to use as a utility to create a error object.
- Here we need to create a `apiError` class which extends the features of `Error` class.
- And then create a `constructor` function to initialize the class and set the property value.
- in the constructor we need to set the `stausCode`, `message`, `errors` and `stack` property and `super` function to set the message.
- Then set the data to null, success to false and then export the `apiError` class like `export default apiError;`
- And also if there is a error in stack set the stack property else use `Error.captureStackTrace(this, this.constructor);` to capture the stack trace.

## Step 13:

- Built a healthcheck logic inside the `controller/healthCheck.controller.js` file to check the database connection and server connection.
- For this first we need to import the `apiResponse` and `asyncHandler` from the `utils` folder.
- Then create a `healthCheck` function to check the database connection and server connection.
- In the function we call `asyncHandler` with help of request and response as a async parameter and then return the response with the status to 200 and json data as apiResponse like `res.status(200).json(apiResponse({ message: "Server is running" }));`
- and then export the `healthCheck` function like `export default healthCheck;`

## Step 14:

- Now each of the `model` have their own `controller` and each of the `controller` have their own `route` and each of the `route` have their own `middleware` so that we can create a complete backend for our project.
- Now we need to create a `healthCheck` route to check the database connection and server connection.
- For this first we need to import the `Router` from the `express` package and also import the `healthCheck` from the `controller/healthCheck.controller.js` file.
- Now initialize the router object using `const router = Router();`
- Then with help of this router object we can serve a get request to `/` route to check the database connection and server connection useing `healthCheck` controller as like `router.route("/").get(healthCheck)` and then export the router object like `export default router;`

## Step 15:

- To use the `healthCheck` route first we need to import the `heathCheckRouter` from the `routes/healthCheck.routes.js` file to `app.js`.
- Then use a middleware to use the `healthCheck` routes like `app.use("/api/v1/healthCheck", heathCheckRouter);`
- By doing this if we want any more routes in healthcheck then we need to just modify the router object in the `routes/healthCheck.routes.js` file and then export the router object like `export default router;`

## Step 16:

- Create a user model inside `user.model.js` file.
- First import `mongoose` and `Schema` from the `mongoose` package.
- Then create a schema using `const userSchema = new Schema({})`
- Now create a model using `export const User = mongoose.model("User", userSchema);`
- Now inside the `userSchema` we need to create a `username` field to store the username of the user. in the username object we need to set the `type`, `required`, `unique`, `lowercase`, `trim` and `index`property.
- And also create `email`, `fullname`, `avatar`, `password`, `coverImage`, `refreshToken` field to store the password of the user with appropriate property.
- And also we need to create `watchHistory` field to store the watch history of the user by useing `type` and `ref` property. `type` property hold the ObjectId and ref property hold the name of the model.
- Then we need to use `timestamps` as true to add the createdAt and updatedAt field to the model.

## Step 17:

- Create video model inside `video.model.js` file.
- First import `mongoose` and `Schema` from the `mongoose` package.
- Then create a schema using `const videoSchema = new Schema({})`
- Now create a model using `export const Video = mongoose.model("Video", videoSchema);`
- Now inside the `videoSchema` we need to create all field like `videoFile`, `thumbnail`, `owner`, `title`, `description`, `duration`, `views` and `comments` field to store the video details of the user.

## Step 18:

- Create playlist model inside `playlist.model.js` file.
- First import `mongoose` and `Schema` from the `mongoose` package.
- Then create a schema using `const playlistSchema = new Schema({})`
- Now create a model using `export const Playlist = mongoose.model("Playlist", playlistSchema);`
- Now inside the `playlistSchema` we need to create all field like `name`, `description`, `videos`(array of VIdeo ObjectId) and `owner` field to store the playlist details of the user.
- And also we need to use `timestamps` as true to add the createdAt and updatedAt field to the model.

## Step 19:

- Create like model inside `like.model.js` file.
- First import `mongoose` and `Schema` from the `mongoose` package.
- Then create a schema using `const likeSchema = new Schema({})`
- Now create a model using `export const Like = mongoose.model("Like", likeSchema);`
- Now inside the `likeSchema` we need to create all field like `video`, `user` field to store the like details of the user.
- And also we need to use `timestamps` as true to add the createdAt and updatedAt field to the model.

## Step 20:

- Create comment model inside `comment.model.js` file.
- First import `mongoose` and `Schema` from the `mongoose` package.
- Then create a schema using `const commentSchema = new Schema({})`
- Now create a model using `export const Comment = mongoose.model("Comment", commentSchema);`
- Now inside the `commentSchema` we need to create all field
- And also we need to use `timestamps` as true to add the createdAt and updatedAt field to the model.

## Step 21:

- Create tweet model inside `tweet.model.js` file.
- First import `mongoose` and `Schema` from the `mongoose` package.
- Then create a schema using `const tweetSchema = new Schema({})`
- Now create a model using `export const Tweet = mongoose.model("Tweet", tweetSchema);`
- Now inside the `tweetSchema` we need to create all field to store the tweet details of the user.
- And also we need to use `timestamps` as true to add the createdAt and updatedAt field to the model.

## Step 22:

- Create subscription model inside `subscription.model.js` file.
- First import `mongoose` and `Schema` from the `mongoose` package.
- Then create a schema using `const subscriptionSchema = new Schema({})`
- Now create a model using `export const Subscription = mongoose.model("Subscription", subscriptionSchema);`
- Now inside the `subscriptionSchema` we need to create all field to store the subscription details of the user.
- And also we need to use `timestamps` as true to add the createdAt and updatedAt field to the model.

## Step 23:

- Create rest of all models. All logic are same.

## Step 24:

- Now we need to use aggregation pipeline feature to filter out the data from the database.
- To use it first we need to install `mongoose-aggregate-paginate-v2` package by using `npm i mongoose-aggregate-paginate-v2`.
- Acctually we dont need to use aggregation pipeline in each model, instead we can use it in some specific model like `Video` model to get the videos of a particular user.
- To use it in video model first we need to import `mongooseAggregatePaginate` from the `mongoose-aggregate-paginate-v2` package.
- After that to inject aggregation pipeline in video model we need to use `videoSchema.plugin(mongooseAggregatePaginate);`
- We also need to inject aggregation pipeline in comments model like the same way as in video model.

## Step 25:

- We need to create a method inside the user model for password security.
- First we need a package to hash the password which is `bcrypt`. To install it we need to use `npm i bcrypt`.
- After that we need to import `bcrypt` inside the user model.
- Now we need to use a pre hook to hash the password before saving it into the database.
- To use it we need to use `userSchema.pre("save", async function (next) {})`. The function inside the pre hook must always be as a normal function not the arrow function because we need to use `this` keyword or so to say context inside the function. In the async function we need a `next` parameter to go to the next middleware.
- Now we need to use `bcrypt` to hash the password like `this.password = await bcrypt.hash(this.password, 10);` and also we need to use `next();` to go to the next middleware.
- Now if say we just want to update the username of the user, It will automatically update the password too because of the pre hook. To prevent this we need a if condition like if the password is not changed or modify then we need to go to the next middleware like `if (!this.isModified("password")) return next();`
- Now we need to use `userSchema.methods.isPasswordCorrect = async function (password) {};` to compare the password given by user and the encrypted password stored in db. To achive it we just need to use `bcrypt.compare(password, this.password);` which is in await because its take time to compare the password and then we need to return the result. If it return true then it means the password is correct.

## Step 26:

- Now we need to check if the user is login or not with help of refresh and access token.
- For this first we need to install `jsonwebtoken` package by using `npm i jsonwebtoken`.
- Now we need to create a access token inside the user model like `userSchema.methods.generateAccessToken = function () {};`
- Inside the function we need create short lived access token. First we need to import `jsonwebtoken` inside the function.
- Then we need to use `jwt.sign({ _id: this._id }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY })` to create the short lived access token. We can also assign more information like `email: this.email, username: this.username, fullname: this.fullname,` in the payload but neccessary all the time.
- In the .env file we need to add the JWT_ACCESS_TOKEN_SECRET and JWT_ACCESS_TOKEN_EXPIRY. For safety we need to set some random string in the JWT_ACCESS_TOKEN_SECRET.(Many service are there to generate a random string for token secret)

## Step 27:

- Now we need to create a refresh token inside the user model like `userSchema.methods.generateRefreshToken = function () {};`
- Inside the function we need create long lived refresh token. First we need to import `jsonwebtoken` inside the function.
- Then we need to use `jwt.sign({ _id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY })` to create the long lived refresh token.

## Step 28:

- File handleing with cloudinary is the best practice.
- At first in express we dont have any file handleing feature.
- Second to read the cookies from the client we need to install `cookie-parser` package by using `npm i cookie-parser`.
- And also to read the file from the client we need to install `multer` package by using `npm i multer`.
- To use multer first create a `multer.middleware.js` file inside the `middleware` folder.
- Inside the `multer.middleware.js` file we need to import `multer` from the `multer` package.
- Now we need to create a storage for multer where we can set the `destination` with help of a function with `req`, `file` and `cb` parameters. Then we need to call the `cb` (callback function) with `null` and `folder path` as the arguments.
- And also we need to create a `filename` with help of a function with `req`, `file` and `cb` parameters. Then we can set a `uniqueSuffix` or say `random name` for the file like `const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);` and then we need to call the `cb` (callback function) with `null`, `file.fieldname` and `uniqueSuffix` as the arguments like `cb(null, file.fieldname + "-" + uniqueSuffix)` or just we can call the `cb` with `null` and `file.originalname` as the arguments.
- Finally we need to export the `multer` like `export const upload = multer({ storage });` and then we can use this `upload` anywhere in the app

## Step 29:

- To upload the file to cloudinary we need to install `cloudinary` package by using `npm i cloudinary`.
- Now we need to create a `clodinary.js` file inside the `utils` folder.
- Then first we need to create some variable like `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` and `CLOUDINARY_FOLDER_NAME` in the `.env` file.
- Now first we need to import `cloudinary` from the `cloudinary` package inside the `cloudinary.js` file like `import { v2 as cloudinary } from "cloudinary";`.
- Then we need to config the cloudinary with help of `cloudinary.config()` function. And also we need to add the `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` and `CLOUDINARY_FOLDER_NAME` in the `cloudinary.config()` function.
- Now we need to create a async method like `uploadFileToCloudinary` with `localFilePath` parameter.
- Now first import the `fs` from the `fs` package inside the `cloudinary.js` file like `import fs from "fs";`.
- And then inside the `uploadFileToCloudinary` method we need to use `fs.unlinkSync(localFilePath)` to remove the local file path inside the catch block of the method.
- Inside the try block of the method we need to apply the logic to upload the local file into the cloudinary. For doing so we need to use `cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })` to upload the file. This takes time so we need to use await and also hold the response in a variable like `const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });`. And then for testing purpose we need to use `console.log("File is upload in cloudinary ", response.url);` to print the cloudinary url.
- Also after the file is upload into cloudinary if we need to delete it from the local folder we need to use `fs.unlinkSync(localFilePath)` to remove the local file path.
- And finally return the response so that we can use it in the route.
- export the `uploadFileToCloudinary` method.

## Step 30:

- Now we need to create a controller for the user model in `user.controller.js` file inside the `controller` folder.
- Then we need to create a `registerUser` function to register a user. And in the function we use `asyncHandler` with `req`, `res` parameters.
- And export the `registerUser` function. After that we also need a route for the user model in `user.routes.js` file inside the `routes` folder.
- In the `user.routes.js` file we need to import the `registerUser` function from the `user.controller.js` file. and also import the `Router` from the `express` package.
- And also we need to create a router object using `const router = Router();`.
- Then we need to create a route to register a user using `router.route("/register").post(registerUser)` and export the router object.
- Now we need to import the `upload` middleware from the `multer.middleware.js` file inside the `user.routes.js` file.
- After that inside the `post()` method of the route we need to use `upload.fields()` to upload the file.Here we need to upload two image one is `coverImage` and another is `avatar`.So to upload two image we need to use `upload.fields([{"name": "coverImage", "maxCount": 1}, {"name": "avatar", "maxCount": 1}])`.
- Afer that we need to set this user route in `app.js` file by using `app.use("/api/v1/user", userRouter);`

## Step 31:

- Now we need to setup the `registerUser` function in the `user.controller.js` file.
- First we need to extract the `fullname`, `username`, `email`, `password` from the `req.body` object.
- Then we need some validation for the `fullname`, `username`, `email`, `password`. ( Here we can also use some third party validator like zod, etc)
- Now with help of `some()` method we can validate the `fullname`, `username`, `email`, `password` for empty string like `["fullname", "username", "email", "password"].some((field) => field.trim() === "")`.
- And if it is empty then throw an error useing `apiError` class.
- Now we need to import the `User` model from the `user.model.js` file inside the `user.controller.js` file.
- Then we need to check that the user with then respected `email` or `username` already exist or not. For doing so we need to use `User.findOne({ $or: [{ email: email }, { username: username }] })` to find the user and hold it ina variable called `existedUser`.
- And if the user already exist then throw an error useing `apiError` class.
- Now we need to extract the avatar image path like `req.files.avatar[0].path` and hold it in a variable called `avatarLocalPath`
- Now we need to extract the cover image path like `req.files.coverImage[0].path` and hold it in a variable called `coverLocalPath`
- Then if the avatarLocalPath is empty then throw an error useing `apiError` class.
- Now to upload the image in cloudinary first we need to import the `uploadInCludinary` function from the `cloudinary.js` file inside the `user.controller.js` file.
- Then we need to call the `uploadInCludinary` function with help of `avatarLocalPath` and `coverLocalPath` parameters to upload the images in cloudinary and hold the response in a variable called `avatar` and `coverImage`.
- But if the coverLocalPath is empty how we build the logic to upload the cover image in cloudinary. First just initialize the `coverImage` variable with a empty string. And then if there is a cover image local path then only we need to call the `uploadInCludinary` function with help of `coverLocalPath` parameter to upload the cover image in cloudinary and hold the response inside the `coverImage` variable.
- Now we can create a new user using `User.create()` method with help of `fullname`, `username`, `email`, `password`, `avatar`, `coverImage` parameters. In case of avater we need to set the `avatar` field like `avatar: avatar.url` and in case of cover image we need to set the `coverImage` field like `coverImage: coverImage?.url || "" `. And then we need to hold this newly created user in a variable called `user`.
- Then to check the user is created or not we need to call `User.findById(user._id)` to find the user and hold it in a variable called `createdUser`. And also we donot need to send the `password` and `refreshToken` field in the response.For doing so we need to use `select()` like `User.findById(user._id).select("-password -refreshToken")`. Include `-` before the field name to exclude the field from the response.
- Now if the `createdUser` is null then we need to throw an error useing `apiError` class with help of 500 code.
- Now finally we need to return the response with status of 201 and json data of `createdUser` with help of `apiResponse` class like ` return res.status(201).json(new apiResponse(201, createdUser, "User Created"));`
- Now while testing or run this route we encounter a error because of `apiError` class. For this first we need to create `NODE_ENV=development` in the `.env` file. Then create a middleware for handleing error in the `middleware` folder as `error.middleware.js`. In this file we need to import mongoose and also `apiError` and then create a middleware function called `errorHandler` with help of `err`, `req`, `res` and `next` as a parameter. Inside the function first we set the `err` in a variable called `error`. Then we need to check if the error is not a instance of ApiError then we need to set a `statusCode` variable with `error.statusCode` or `error instanceof mongoose.Error` then set the code to `400` otherwise `500`. And also we need to set `message` as `error.message` or any hardcoded error message. Also we need to set the error with help of `apiError` class like `error = new apiError(statusCode, message, error?.errors || [], err.stack)` and finally we nedd set the `response` with distructing the erorr like `...error`, `message` with `error.message` and also if we are in developement mode then stack trace should be `stack: error.stack` and if we are in production mode then stack trace should be `{}`. and then return the response with statusCode and json response data like `return res.status(statusCode).json(response);`
- export the `errorHandler` function. And to work that middleware we need to add the `error.middleware.js` like `app.use(errorHandler)` middleware inside the `app.js` at the end of the file.
- Now test the `register` route. It may a error because of `cloudinary` to not pick the `api_key` and `api_secret` from the `.env` file. For this we need to import the `dotenv` from `dotenv` package and then use `dotenv.config()` to read the `.env` file with help of path.

## Step 8:

- Now in any case file in cloudinary uploaded successfully but it may not be upload in server. In that case we need to takeing care of this like if there is any error is happening after the cloudinary upload then we need to delete the file from the local folder and cloudinary too.
- For this first we need to create a async method like `deleteFromCloudinary` with `publicId` parameter.
- and then we need to wrap up the mothod with try/catch block. In catch block we just log the error with a message. and return null.
- In the try block we need to call `cloudinary.uploader.destroy(publicId)` with help of `publicId` parameter and hold the response inside a variable called `deletedImage`.
- Now we need to export the method.
- And then in the `user.controller.js` file first we need to to select all code for creating new user and paste those code inside a try block and in the catch block we need to first log the error and then if the avatar is there we need to call the `deleteFromCloudinary` method with help of `avatar.public_id` parameter. And also if the coverImage is there we need to call the `deleteFromCloudinary` method with help of `coverImage.public_id` parameters. and finally throw the error with help of `apiError` class.

## Step 9:

- Now we need to set up the login user function in the `user.controller.js` file.
- But before that we need to create a async method like `generateAccessAndRefreshToken` with `userId` parameter.
- Inside the method first we need a try/catch block. In the try block we need to find the user with help of `await User.findById(userId)` and hold the user in a variable called `user`.
- If the user not found then throw an error useing `apiError` class.
- Now we need to generate the access token with help of the `generateAccessToken` method mentioned in the user model like `await user.generateAccessToken()`. and hold the access token in a variable called `accessToken`.
- Then we also need to generate the refresh token with help of the `generateRefreshToken` method mentioned in the user model like `await user.generateRefreshToken()`. and hold the refresh token in a variable called `refreshToken`.
- Now we need to set the `refreshToken` inside the user object like `user.refreshToken = refreshToken`. and then save the user with help of `await user.save()` like ` await user.save({ validateBeforeSave: false });`.
- Now we need to return the access token and refresh token.
- Then in the catch block we need to log the error and also use apiError.
- Now we need to work in the `loginUser` function in the `user.controller.js` file.
- In the function first we need to get the data like email, username and password from the request body like `const { email, username, password } = req.body;`
- Then we need some validation like if the email field is empty then throw an error using `apiError` class.
- Now check is there any user is already exist with help of `await User.findOne({ $or: [{ email }, { username }] })` and hold the user in a variable called `user`.
- If the user not found then throw an error using `apiError` class.
- Now if the user found then compare the password with help of `await user.isPasswordCorrect(password)` and hold the result in a variable called `isPasswordValid`.
- If the password is not valid then throw an error using `apiError` class.
- Now we need to generate the access token and refresh token with help of `generateAccessAndRefreshToken` and destructure the result with accessToken and refreshToken like `const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);`
- Now we again find the user with help of `user._id` and also deselect some field like `password` and `refreshToken` with help of `select("-password -refreshToken")` and hold the user in a variable called `loggedInUser` so that we can send the user in the response.
- After that we also need to set some `options` like `httpOnly: true` to prevent the client to access the cookie. and `secure` set to `process.env.NODE_ENV !== "development"` to prevent the client to access the cookie in development environment.
- return the response, first set the status to 200, then set the cookie with help of `.cookie("accessToken", accessToken, options)` and also set the cookie with help of `.cookie("refreshToken", refreshToken, options)` and finally send the response with help of `apiResponse` class with help of `loggedInUser`.
- Finally export the `loginUser` function.

# Access and Refresh Token :

- Access token are short lived and refresh token are long lived. Whenever a user authenticate with credatials then the server issue an access token and refresh token.And then the user or client uses the access token to access the protected routes or API. When the access token expires, the client send the refresh token to the server and then server validate the refresh token and issue a new access token.

# Step 10:

- Refresh the access token for generating a new access token we need to create a async method like `refreshAccessToken` with help of `asyncHandler` and `req` and `res` parameters in user.controller.js.
- First the logic is whenever the access token is expire then the client go to a specific route where the client send the refresh token to the server. For doing so first grab the refresh token from body or from cookies and hold it in a variable called `newRefreshToken` like `const newRefreshToken = req.cookies.refreshToken || req.body.refreshToken;`
- Now check if the refresh token is not found then throw an error using `apiError` class.
- Now first we need to import `jwt` from `jsonwebtoken` package.
- Now if the refresh token is found then first we need a try/catch block. In the try block we need to verify the refresh token with help of `jwt.verify(newRefreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)` and hold the result in a variable called `decoded`.
- Inside the `decoded` token we have a `_id` field and with help this we can find the user with help of `await User.findById(decoded?._id)` and hold the user in a variable called `user`.
- If the user not found then throw an error using `apiError` class.
- Now we need to check the refresh token is same as the refresh token of the user. if the refresh token is not same then throw an error using `apiError` class like `if (newRefreshToken !== user?.refreshToken) {//apiError}`.
- Now we need to generate the access token so for that first set the `options` like `httpOnly` and `secure` like `const options = { httpOnly: true, secure: process.env.NODE_ENV !== "development" };`
- and finally generate the access token with help of `generateAccessAndRefreshToken` and destructure the result with accessToken and refreshToken like `const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);`
- Now we need to return the response with status of 200, cookie with help of `.cookie("accessToken", accessToken, options)` and `.cookie("refreshToken", newRefreshToken, options)` and finally send the response in json with help of `apiResponse` class with help of accessToken and refreshToken like ` new apiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully").`
- In the catch block we need to throw an error of 500 with help of `apiError` class.
- Finally export the `refreshAccessToken` function.

# Step 11:

- Now we need a method like `logoutUser` in the `user.controller.js` file with help of `asyncHandler` and `req` and `res` parameters.
- Now the main part is for logout a specific user we need to get the id of the user but we cannot get the id from the request body. For doing so we need a middleware. So create a middleware like `auth.middleware.js` in the `middleware` folder.
- In the middleware first we need to import `jwt`, `User`, `apiError` and `asyncHandler`.
- Then create a method like `verifyJWT` with help of `asyncHandler` and `req`, `next` as a parameters.
- First we need to grab the refresh token from body or from cookies and hold it in a variable called `token` like `const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");`(In case of web it is ok to use req.cookies.accessToken but in case of api we need to use req.header("Authorization")?.replace("Bearer ", "");)
- If the token is not found then throw an error using `apiError` class.
- Now we need a try/catch block, In the try block we need to verify the token with help of `jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)` and hold the result in a variable called `decoded`.
- Inside the `decoded` token we have a `_id` field and with help this we can find the user with help of `await User.findById(decoded?._id).select("-refreshToken -password")` and hold the user in a variable called `user`.
- If the user not found then throw an error using `apiError` class.
- Now we need to set the user object in the request with help of `req.user = user;` so that we can get the user information from the middleware.
- Now forward the request to the next middleware by useing `next();`
- In the catch block we need to throw an error of 401 with help of `apiError` class like `throw new apiError(401, error?.message || "Invalid token");`.
- Now handle the `logoutUser` function in the `user.controller.js` file.
- Now we can await and run the `findByIdAndUpdate` in the `User` model with help of `req.user._id` and set the `refreshToken` to `undefined`(We also use "", null so it will be decided by the database which one to use) and also set the `new` to true like `await User.findByIdAndUpdate(req.user._id, {$set: {refreshToken: undefined}}, {new: true});`
- Then set the 'options`like`httpOnly: true`to prevent the client to access the cookie and`secure`set to`process.env.NODE_ENV !== "development"` to prevent the client to access the cookie in development environment.
- And then return the response with status of 200 and clear the cookie with help of `.clearCookie("accessToken", options)` and `.clearCookie("refreshToken", options)` and send a json response with help of apiResponse as 200 and with empty data and a message.
- Finally export the `logoutUser` function.
- Now to perform the logout we need to use `logoutUser` function in the `user.routes.js` file. Where first we need to import the `verifyJWT` middleware and also the `logoutUser` function.
- Now we know then the logout route is secure route, mean to say the user need to be authenticated to perform the logout. So for that we neeed to first use the `verifyJWT` middleware and then use the `logoutUser` function like `router.route("/logout").post(verifyJWT, logoutUser);`

# Step 12:

- Now we need to create some controller for doing CRUD operation in the `user.controller.js` file. For that first we need to just initialize or declare the controller like `changeCurrentPassword`, `getCurrentUser`, `updateAccountDetails`, `updateUserAvatar`, `updateUserCoverImage` as a boilerplate.
- Now lets build the `changeCurrentPassword` controller.
- First we need to grab the current password and new password from the request body like `const { currentPassword, newPassword } = req.body;`
- Now find the user with the help of `user._id` and hold it in a variable called `user` like `const user = await User.findById(req.user._id);`
- Now compare the current password with help of `await user.isPasswordCorrect(currentPassword)` and hold the result in a variable called `isPasswordValid`.
- If the password is not valid then throw an error using `apiError` class.
- Now set the password with the help of `user.password = newPassword` and then save the user with help of `await user.save({ validateBeforeSave: false });`
- Now return the response with status of 200 and send a json response with help of apiResponse as 200 and with empty data and a message.

- Now lets build the `getCurrentUser` controller.
- Its the simple controller to build because we have already done all the work in the `verifyJWT` middleware and get the user information in the `req.user` object.
- Now return the response with status of 200 and send a json response with help of apiResponse as 200 and with the user data (req.user) and a message.

- Now lets build the `updateAccountDetails` controller.
- Now we need to grab the fullname, email (or what data you want to update) from the request body like `const { fullname, email } = req.body;`
- Then if the email and fullname is empty then throw an error using `apiError` class.
- Now find the user useing `findByIdAndUpdate` method with help of `user._id` and set the `fullname` and `email` and also set `new` to true like `await User.findByIdAndUpdate(user._id, { $set: { fullname, email } }, { new: true });`
- After that we need to delselect the password and refreshToken from the user object with help of `select("-password -refreshToken")` and hold it in a variable called `user`.
- Now return the response with status of 200 and send a json response with help of apiResponse as 200 and with the user data and a message.

- Now lets build the `updateUserAvatar` controller.
- Now we need to grab the avatar from the request file like `req.file?.path` and hold it in a variable called `avatarLocalPath`.
- if the avatarLocalPath is empty then throw an error using `apiError` class.
- Now to upload the image in cloudinary we need to call the `uploadInCludinary` function with help of `avatarLocalPath` parameter to upload the image in cloudinary and hold the response in a variable called `avatar`.
- Then if the avatar is empty then throw an error using `apiError` class.
- Now find and update the user with the help of `req.user?._id` and set the `avatar` with `avatar.url` field like `await User.findByIdAndUpdate(user._id, { $set: { avatar: avatar.url } }, { new: true });`
- and then delselect the password and refreshToken from the user object with help of `select("-password -refreshToken")` and hold it in a variable called `user`.
- Now return the response with status of 200 and send a json response with help of apiResponse as 200 and with the user data and a message.

- Now lets build the `updateUserCoverImage` controller.
- Now we need to grab the coverImage from the request file like `req.file?.path` and hold it in a variable called `coverLocalPath`.
- if the coverLocalPath is empty then throw an error using `apiError` class.
- Now to upload the image in cloudinary we need to call the `uploadInCludinary` function with help of `coverLocalPath` parameter to upload the image in cloudinary and hold the response in a variable called `coverImage`.
- Then if the coverImage is empty then throw an error using `apiError` class.
- Now find and update the user with the help of `req.user?._id` and set the `coverImage` with `coverImage.url` field like `await User.findByIdAndUpdate(user._id, { $set: { coverImage: coverImage.url } }, { new: true });`
- and then delselect the password and refreshToken from the user object with help of `select("-password -refreshToken")` and hold it in a variable called `user`.
- Now return the response with status of 200 and send a json response with help of apiResponse as 200 and with the user data and a message.
- Finally export the `changeCurrentPassword`, `getCurrentUser`, `updateAccountDetails`, `updateUserAvatar`, `updateUserCoverImage` functions.

# Aggregation Pipeline

- The aggregation pipeline is a powerful feature in MongoDB, used for processing and transforming collections of documents into aggregated results. It allows you to perform complex data transformations and computations on data stored in MongoDB collections using a series of stages.

# Step 13:

- We need to aggregation pipeline in `getUserChannelProfile` function in the `user.controller.js` file.
- First we need to grab the username from the url and based on that we can find the user. For this we can use `req.params` like `const { username } = req.params;`
- Now if there is not username inside the params then throw an error using `apiError` class.
- Now we need to use the aggrigation pipeline to find the channel profile of the user. For doing so we need to filter the user by useing stages of the aggregation pipeline.
- First statge we need to match the username with help of the username inside the params and change it into lowercase for better matching like `{ $match: { username: username?.toLowerCase() } }`. So that the matching username will only be filtered from the user collection.
- Second stage we need to `lookup` from `subscriptions` model where the `localField` is `_id` becoz we need to match it with the `foreignField` which is `channel` field from the `subscriptions` model and `as` is `subscribers` because we need to called these user as `subscriber` and also we get all the subscriber data because of this stage.
- In the next stage where we want to grab all the subscribed list which the user acctally subscribed. For getting this we need to use `lookup` again which lookup `from` the `subscriptions` model and `localField` is `_id` and `foreignField` is `subscriber` and then we need to called it `as` `subscriberedTo`.
- In the next stage we need to add some field by useing `$addFields` and set the `subscriberCount` field with the length of the `subscribers` field which we create in second stage like `$addFields: { subscriberCount: { $size: "$subscribers" } }`. We use `$` before the field name because we create it on second stage. And also we need add another field called `channelsSubscribedToCount` which is the length of the `subscriberedTo` field with help of `size` operator like `$addFields: { channelsSubscribedToCount: { $size: "$subscriberedTo" } }`.
- Now we also need to add a `isSubscribed` field where we can find if a user is in the subscriber list of the current user then this field set to true otherwise set to false. For these we use a condition with help of `$cond` operator where we need to set the `if` with help of `$in` like in the current user or so to say `req.user?.id` a field called `$subscribers.subscriber` is present then in the `then` part we set the `isSubscribed` field to true and in the `else` part we set the `isSubscribed` field to false like `$cond: { if: { $in: [req.user?.id, "$subscribers.subscriber"] }, then: true, else: false }`.
- Finally in the last stage or pipeline we need to `project` all the required field like `username`, `fullname`, `email`, `avatar`, `subscriberCount`, `channelsSubscribedToCount`, `isSubscribed`, `coverImage`by setting then with `1` like `$project: { username: 1, fullname: 1, email: 1, avatar: 1, subscriberCount: 1, channelsSubscribedToCount: 1, isSubscribed: 1, coverImage: 1 }`.
- And finally the filtered data getting from the pipeline hold in a variable called `channel`.
- If the channel is empty or so to say length is 0 like `!channel?.length` then throw an error using `apiError` class.
- Now return the response with status of 200 and json data of `channel` with help of `apiResponse` class like `return res.status(200).json(new apiResponse(200, channel[0], "Channel Profile fetched successfully"));`

# Step 14:

- Now we need to create a `getWatchHistory` function in the `user.controller.js` file to fetch all the watch history of the user with help of aggregation pipeline by use `aggregate` method from the `user` model and pass the pipeline like `const watchHistory = await User.aggregate([{pipeline}]);`
- In the first stage we need to use `$match` operator to filter the watch history by matching the user id with help of `new mongoose.Types.ObjectId(req.user?.id)` ( We cannot directly use `req.user?.id` in aggregation pipeline) like `$match: { _id: new mongoose.Types.ObjectId(req.user?.id) }`.
- In the second stage we need to use `$lookup` from the `videos` model where the `localField` is `watchHistory` and `foreignField` is `_id` and called it `as` `watchHistory`. After that we can also inject a pipeline inside this stage so that we can filter the watch history with help of `pipeline` as `pipeline: [{stages}]`. For doing this first we need to set first stage which is a `$lookup`. Where `from` is `users` model and `localField` is `owner` and `foreignField` is `_id` and called it `as` `owner`. And then inside the lookup we need another `pipeline` where we need to use `$project` operator and set field like `fullname`, `username` and `avatar` to 1. After that we also use another pipeline inside the first `lookup` we need to use `$addfields` operator to set `owner` field to first element of the owner line `owner:  { $first: "$owner" } `
- Then hold the filtered data in a variable called `user`
- And finally return the response with status of 200 and json data of `watchHistory` from the `user` with help of `apiResponse` class like `return res.status(200).json(new apiResponse(200, user[0]?.watchHistory, "Watch history fetched successfully"));`
