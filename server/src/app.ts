import { errorMiddleware } from "./apis/middlewares/error";
import expressLoaders from "./loaders/expressLoaders";
import mongooseLoaders from "./loaders/mongooseLoaders";
import socketLoaders from "./loaders/socketLoaders";
import swaggerLoader from "./loaders/swaggerLoader";
mongooseLoaders();
export const app = expressLoaders();
swaggerLoader(app)
errorMiddleware(app)
export const io = socketLoaders(app);
