import dotenv from "dotenv";

import dbConnect from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

//Connect the db and then called the app.listen from express
dbConnect()
  .then(
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    })
  )
  .catch((e) => {
    console.log("DB conncection failed :: ", e);
  });
