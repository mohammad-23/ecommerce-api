import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.listen({ port: PORT }, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.get("/", async (req, res) => {
  res.send("Hello World");
});
