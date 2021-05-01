import express from "express";
import dotenv from "dotenv";
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

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.listen({ port: PORT }, () => {
  console.log(`Server listening on port ${PORT}`);
});
