import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import appRoutes from "../apis/routes";
import env from "../configs/env";

const app = express();

const expressLoaders = () => {
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    cors({
      credentials: true,
      origin: [env.domain.CLIENT as string],
    }),
  );
  app.use(cookieParser());
  app.get("/", (req, res) => {
    res.status(200).json("this is Social Media");
  });
  app.use(appRoutes);
  return app;
};

export default expressLoaders;
