import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import appRoutes from "../apis/routes";
import env from "../configs/env";
import initializePassport from "../configs/passport";
import passport from "passport";
import MongoDBStore from "connect-mongodb-session";
import session = require("express-session");
import logger from "morgan";
const app = express();

const expressLoaders = () => {
  const MongoStore = MongoDBStore(session);

  initializePassport(passport);
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    cors({
      credentials: true,
      origin: [env.domain.CLIENT as string],
    }),
  );

  app.use(cookieParser());
  app.use(logger("dev"));
  //session config
  app.use(
    session({
      name: env.passport.sessionName || "socialzone_sid",
      secret: env.passport.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      },
      store: new MongoStore({
        uri: env.database.mongoUrl,
        collection: "sessions",
        expires: 30 * 24 * 60 * 60 * 1000, // 7 days
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.get("/", (req, res) => {
    res.status(200).json("this is Social Media");
  });
  app.use(appRoutes);
  return app;
};

export default expressLoaders;
