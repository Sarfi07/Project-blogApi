// routes/authRoutes.js
import express from "express";
import passport from "../config/passport.js";
import { generateToken } from "../utils/jwtUtils.js";
import prisma from "../utils/prismaClient.js";
import bcrypt from "bcrypt";

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

router.post("/auth/signup", async (req, res, next) => {
  const { username, name, password, role } = req.body;
  try {
    const hassedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        name,
        password: hassedPassword,
        role,
      },
    });

    // Send a successful response back
    return res
      .status(200)
      .json({ message: "User signed up successfully", user });
  } catch (err) {
    // Catch any errors and send an error response
    return res.status(403).json({ message: "Unable to sign you up.", err });
  }
});

// Route for logout
router.post("/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
