import express from "express";
import multer from "multer";
import { addTool } from "../Controller/toolController.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/add", isAuthenticated, upload.single("file"), addTool);

export default router;
