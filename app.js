import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnection } from "./Config/dbConnection.js";
import userRoute from "./Router/userRoute.js";
import toolRoutes from "./Router/toolRoute.js";

const app = express();
dotenv.config({ path: "./Config/.env" });
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
app.use("/api/user", userRoute);
app.use("/api/tool", toolRoutes);
dbConnection();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
