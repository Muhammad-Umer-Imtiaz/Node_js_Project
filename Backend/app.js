import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./Config/dbConnection.js";
import userRoute from "./Router/userRoute.js";
import toolRoutes from "./Router/toolRoute.js";

dotenv.config({ path: "./Config/.env" });

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true,limit: "10mb"  }));

// Routes
app.use("/api/user", userRoute);
app.use("/api/tool", toolRoutes);

// Connect DB
dbConnection();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Frontend Url is ${process.env.FRONTEND_URL}`);
  console.log(`app is listen at port ${port}`);
});
