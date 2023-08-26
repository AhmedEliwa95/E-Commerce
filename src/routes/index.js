const addressRouter = require("./addressRoute");
const authRouter = require("./authRoute");
const brandRouter = require("./brandRoute");
const categoryRouter = require("./categotyRoute");
const couponRouter = require("./couponRoute");
const productRouter = require("./productRoute");
const reviewRouter = require("./reviewRoute");
const subCategoryRouter = require("./subCategoryRoute");
const userRouter = require("./userRoute");
const wishListRouter = require("./wishListRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishList", wishListRouter);
  app.use("/api/v1/addresses", addressRouter);
  app.use("/api/v1/coupons", couponRouter);
};

module.exports = mountRoutes;
