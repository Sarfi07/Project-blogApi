// config/passport.js
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../utils/prismaClient.js";
import "dotenv/config";
import bcrypt from "bcrypt";

// Local Strategy for login
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { username } });

      if (!user || !(password === user.password)) {
        return done(null, false, { message: "Invalid credentials" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
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
