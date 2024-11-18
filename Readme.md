# Its a complete backend playground for explore all features

=======

# Its a complete backend playground to explore all features

## step 1 setup the project for codeing

### Create some basic file structure like create controller, db, middleware, models, utils folders to organise the structure

### Install the prettier locally for the project so that all contributor can have same code structure and also create .prettierignore

### Install the nodemon

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
