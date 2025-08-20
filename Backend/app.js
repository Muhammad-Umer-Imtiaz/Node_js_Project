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
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoute);
app.use("/api/tool", toolRoutes);

// Connect DB
dbConnection();
const port = process.env.PORT 
app.listen(port,()=>{
console.log(`app is listen at port ${port}`)
})