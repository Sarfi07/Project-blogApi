// routes/authRoutes.js
import express from "express";
import passport from "../config/passport.js";
import { generateToken } from "../utils/jwtUtils.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend" });
});

// Login route for generating JWT token
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "Unauthorized" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({ token });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  // todo: remove token from localstorage
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
