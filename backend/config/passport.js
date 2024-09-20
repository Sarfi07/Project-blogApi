// config/passport.js
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../utils/prismaClient.js";
import "dotenv/config";
import bcrypt from "bcrypt";

// Use passReqToCallback to access the role in the request body
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const { role } = req.body; // Extract the role from req.body

      try {
        // Find the user by username and role
        const user = await prisma.user.findFirst({
          where: { username, role },
        });
        console.log(req.body);
        // If user is not found or role does not match
        if (!user) {
          return done(null, false, { message: "Invalid credentials or role" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // Return the user if authentication succeeds
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// JWT strategy options
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

// JWT strategy
passport.use(
  new Strategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.id },
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;
