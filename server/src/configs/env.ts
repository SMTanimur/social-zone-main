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
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },
  passport: {
    SESSION_SECRET:process.env.SESSION_SECRET || 'secret',
    sessionName: process.env.SESSION_NAME || 'szone_sid',
    jwtSecretKey: process.env.JWT_SECRET_KEY || "SECRET_KEY",
    expiredAccessToken: process.env.EXPIRED_ACCESS_TOKEN || "30d",
    expiredRefreshToken: process.env.EXPIRED_REFRESH_TOKEN || "365d",
    USER_VERIFICATION_TOKEN: process.env.USER_VERIFICATION_TOKEN_SECRET || 'dfjdkjf'
  },
};

export default env;
