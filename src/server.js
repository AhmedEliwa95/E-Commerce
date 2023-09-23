const path = require("path");

const express = require("express");
// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

const dbConnection = require("../config/database");
const APIError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const mountRoutes = require("./routes");
const { createWebhook } = require("./controllers/orderController");

// this backend app has hosted on serverless cloud: Cyclic so we need to call the connection firstly
// dbConnection();

// Create Express APP
const app = express();

/// to make other domains to access my App APIs, like any frontend app that will try to call my endpoints
app.use(cors());
app.options("*", cors());

// to compress all responses to reduce the size of the body
app.use(compression());

// webhook checkout: to use it inside the ordering by card payement method
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  createWebhook
);
/// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
// to accept json content & limiting the size of the request body to 20kb to save the server memory
app.use(express.json({ limit: "20" }));

// to serve the static files from the server like images
app.use(express.static(path.join(__dirname, "uploads")));

//////// Mount Routes \\\\\\\\\\\
mountRoutes(app);

/// to handle Forigin Routes
app.all("*", (req, res, next) => {
  next(new APIError(`Can't find this route: ${req.originalUrl}`, 404));
});

/// Error Handling By Express // to activate express error handler middleware, use the 4 paramaters
/// Global Error Handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 3000;
// const server =
dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`E-commerce App is listenning on port: ${PORT}`);
  });
});

// to handle non express asynchronus errors
// process.on("unhandledRejection", (err) => {
//   console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
//   server.close(() => {
//     console.error(`Shutting down....`);
//     process.exit(1);
//   });
// });
