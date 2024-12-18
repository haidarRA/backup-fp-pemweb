import { connectToDatabase } from "./db-connection";
import express from "express";
import { authRouter } from "./routes/auth.router";
import { Verification } from "./middleware/auth";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", authRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Express is running on Port ${PORT}`);
});

connectToDatabase();