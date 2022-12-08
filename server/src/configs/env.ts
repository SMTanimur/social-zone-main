import dotenv from "dotenv";
dotenv.config();

const env = {
  node: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
  isDevelopment: process.env.NODE_ENV === "development",
  app: {
    port: process.env.PORT || 8000,
    apiUrl: process.env.API_URL || "localhost:8000",
  },
  database: {
    mongoUrl: process.env.MONGODB_URL || "",
  },
  domain:{
    CLIENT: process.env.CLIENT_URL
  },
  passport: {
    jwtSecretKey: process.env.JWT_SECRET_KEY || "SECRET_KEY",
    expiredAccessToken: process.env.EXPIRED_ACCESS_TOKEN || "30d",
    expiredRefreshToken: process.env.EXPIRED_REFRESH_TOKEN || "365d",
  },
};

export default env;
