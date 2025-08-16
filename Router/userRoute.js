import express from "express";
import {
  getProfile,
  login,
  logout,
  signup,
} from "../Controller/userController.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["userName", "email"] })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     const token = jwt.sign(
//       { id: req.user._id, email: req.user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//     });
//   }
// );
router.get("/profile/:id", isAuthenticated, getProfile);

export default router;
