import express from "express";
import {
  forgetPassword,
  getProfile,
  login,
  logout,
  resetPassword,
  signup,
} from "../Controller/userController.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile/:id", isAuthenticated, getProfile);
router.post("/forget-password", forgetPassword);
router.post("/reset/:id", resetPassword);
export default router;
