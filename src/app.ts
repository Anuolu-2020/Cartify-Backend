// Dependencies
import express from "express";
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import { RedisStore as rateLimitRedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";

//Middlewares
import { welcomeToApi } from "./middlewares/welcome.middleware";
import { checkApiVersion } from "./middlewares/checkApiVersion.middleware";
import { isAuthenticated } from "./middlewares/checkAuthentication";
import { globalErrorMiddleware } from "./middlewares/error/global.error.middleware";

//Utils
import { logger } from "./utils/logger";

//Routes
import { authRoute } from "./routes/Auth/auth.route";
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

app.use(express.json());

// Parse urlencoded request bodies into req.body
app.use(express.urlencoded({ extended: true }));

//Redis connection client
const redisClient = createClient({ url: process.env.REDIS_URL });

//connect to redis
redisClient.connect();

//RATE LIMITER MIDDLEWARE CONFIGURATION
const limiter = rateLimit({
	windowMs: 20 * 60 * 1000, // 15 minutes
	max: 50, // limit each IP to 50 requests per windowMs
	message: "Too many requests from this IP, please try again after 15 minutes",
	standardHeaders: true, // Standard headers
	legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
	store: new rateLimitRedisStore({
		sendCommand: (...args: string[]) => redisClient.sendCommand(args),
	}),
});

//RATE LIMITER
app.use(limiter);

//For setting secure headers
app.use(helmet());

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
