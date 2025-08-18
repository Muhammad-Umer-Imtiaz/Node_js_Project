import express from "express";
import multer from "multer";
import {
  addTool,
  categoryPagination,
  pagination,
  Search,
  submitTool,
  suggestions,
} from "../Controller/toolController.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/add", isAuthenticated, upload.single("file"), addTool);
router.post("/submit/:id", isAuthenticated, submitTool);
router.post("/search", isAuthenticated, Search);
router.get("/pagination", pagination);
router.post("/category", categoryPagination);
router.get("/suggestions/:id", suggestions);
export default router;
