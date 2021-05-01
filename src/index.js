import express from "express";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.listen({ port: PORT }, () => {
  console.log(`Server listening on port ${PORT}`);
});
