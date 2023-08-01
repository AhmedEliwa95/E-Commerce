const path = require("path");

const express = require("express");
// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const morgan = require("morgan");
const dbConnection = require("../config/database");
const APIError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const categoryRouter = require("./routes/categotyRoute");
const subCategoryRouter = require("./routes/subCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");

dbConnection();

// Create Express APP
const app = express();

/// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
// to accept json content
app.use(express.json());

// to serve the static files from the server like images
app.use(express.static(path.join(__dirname, "uploads")));

//////// Mount Routes \\\\\\\\\\\
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subcategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

/// to handle Forigin Routes
app.all("*", (req, res, next) => {
  next(new APIError(`Can't find this route: ${req.originalUrl}`, 404));
});

/// Error Handling By Express // to activate express error handler middleware, use the 4 paramaters
/// Global Error Handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`E-commerce App is listenning on port: ${PORT}`);
});

// to handle non express asynchronus errors
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
