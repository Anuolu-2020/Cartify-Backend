import dotenv from "dotenv";
import { app, redisClient } from "./app";
import mongoose from "mongoose";
import colors from "colors";

colors.enable();

//Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  redisClient.disconnect();
  mongoose.connection.close();
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

//Connect to database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(">".green, "Database Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log(">".red, "Error connecting to database");
    console.log(">".red, "Database Shutting down...");
    mongoose.connection.close();
  });

//Log success message when redis connects
redisClient.on("ready", function() {
  console.log(">".yellow, "Successfully connected to Redis.");
});

redisClient.on("error", function(err) {
  console.log(err);
  console.log(">".red, "Error connecting to Redis");
  console.log(">".red, "Redis Shutting down...");
  redisClient.disconnect();
  console.log(">".red, "Database Shutting down...");
  mongoose.connection.close();
  console.log((">".red, "Server Shutting down..."));
  server.close(() => {
    process.exit(1);
  });
});

//Start server
const PORT = process.env.PORT || 3000;

const DOMAIN = process.env.DOMAIN;

const server = app.listen(PORT, () => {
  console.log(">".red, `listening on ${DOMAIN}:${PORT}/api/v1`);
});

//Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    redisClient.disconnect();
    mongoose.connection.close();
    process.exit(1);
  });
});

export { redisClient };
