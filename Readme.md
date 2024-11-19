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
