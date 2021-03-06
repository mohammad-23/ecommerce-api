import "core-js/stable";
import "regenerator-runtime/runtime";

dotenv.config();

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

require("./models/User");
require("./models/Cart");
require("./models/Order");
require("./models/Product");
require("./models/Category");

const PORT = process.env.PORT || 5000;

const connect = () => {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return mongoose.connection;
};

const app = express();
const connection = connect();

const listen = () => {
  if (app.get("env") === "test") {
    return;
  }

  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
};

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

const whitelistedOrigins = [
  "http://localhost:3000",
  "https://kappa-com.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (whitelistedOrigins.indexOf(origin) === -1) {
        const errorMessage = `The CORS policy for this site does not
            allow access from the specified Origin.`;

        return callback(new Error(errorMessage), false);
      }

      return callback(null, true);
    },
  })
);

connection
  .on("error", console.log)
  .on("disconnected", connect)
  .once("open", listen);

require("./routes/authRoutes")(app);
require("./routes/userRoutes")(app);
require("./routes/cartRoutes")(app);
require("./routes/orderRoutes")(app);
require("./routes/productRoutes")(app);
