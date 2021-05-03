import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("Connected to MongoLab instance."))
  .on("error", (error) => console.log("Error connecting to MongoLab:", error));

const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

const whitelistedOrigins = ["http://localhost:3000"];

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

require("./routes/authRoutes")(app);
require("./routes/userRoutes")(app);

app.listen({ port: PORT }, () => {
  console.log(`Server listening on port ${PORT}`);
});
