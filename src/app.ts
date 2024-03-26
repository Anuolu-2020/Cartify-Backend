// Dependencies
import express from "express";
import passport from "passport";
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import dotenv from "dotenv";

//Middlewares
import welcomeToApi from "./middlewares/welcome.middleware";
import checkApiVersion from "./middlewares/checkApiVersion.middleware";
import isAuthenticated from "./middlewares/checkAuthentication";
import { globalErrorMiddleware } from "./middlewares/error/global.error.middleware";

//Utils
import { logger } from "./utils/logger";

//Routes
import authRoute from "./routes/Auth/auth.route";
import { userRoute } from "./routes/user.route";
import { router as productRoute } from "./routes/Products/product.route";
import { router as vendorRoute } from "./routes/Products/vendor.route";
import { router as cartRoute } from "./routes/Cart/cart.route";
import { router as reviewRoute } from "./routes/Review/review.route";

const app = express();

dotenv.config();

//CORS
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://localhost:3000",
      "https://localhost:5500",
      "https://localhost:3000",
      "https://localhost:5173",
      "https://localhost:8080",
      "http://localhost:8080",
      "127.0.0.1:8000:8000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.set("trust proxy", 1);

app.use(express.json());

// Parse urlencoded request bodies into req.body
app.use(express.urlencoded({ extended: true }));

//Redis connection client
const redisClient = createClient({ url: process.env.REDIS_URL });

//connect to redis
redisClient.connect();

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
});

// MANAGE COOKIE SESSIONS
app.use(
  session({
    genid: () => {
      return uuidv4();
    },
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      maxAge: 120 * 60 * 60 * 1000, // expires in five-days
      secure: process.env.NODE_ENV === "development" ? false : true,
      sameSite: process.env.NODE_ENV === "development" ? false : "none",
    },
  }),
);

//For setting secure headers
app.use(helmet());

//For passport
app.use(passport.authenticate("session"));

//Initialize Passport
app.use(passport.initialize());

//Session for passport
app.use(passport.session());

//Prevent no-sql injection
app.use(mongoSanitize({ allowDots: true }));

//For compressing response body
app.use(compression());

//For logging
app.use(logger());

app.get("/api/v:version", checkApiVersion, welcomeToApi);

//AUTH ROUTES
app.use("/api/v:version/auth", checkApiVersion, authRoute);

//PRODUCT ROUTES
app.use("/api/v:version/products", checkApiVersion, productRoute);

//CART ROUTES
app.use("/api/v:version/carts", checkApiVersion, isAuthenticated, cartRoute);

//VENDOR ROUTES
app.use("/api/v:version/vendor", checkApiVersion, isAuthenticated, vendorRoute);

//USER'S ROUTES
app.use("/api/v:version/users", checkApiVersion, isAuthenticated, userRoute);

//REVIEW ROUTES
app.use(
  "/api/v:version/reviews",
  checkApiVersion,
  isAuthenticated,
  reviewRoute,
);

//UNDEFINED ROUTES
app.all("*", (_, res) => {
  res.status(404).json({
    message: "Undefined API endpoint accessed.",
    success: false,
  });
});

//GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorMiddleware);

//Export app
export { app, redisClient };
