import express from "express";
import multer from "multer";
import {
  AddTool,
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
router.post("/addtool", isAuthenticated, AddTool); //add tool by users
router.post("/submit/:id", isAuthenticated, submitTool);
router.get("/search", Search);
router.get("/pagination", pagination);
router.get("/category", categoryPagination);
router.get("/suggestions", suggestions);
export default router;
