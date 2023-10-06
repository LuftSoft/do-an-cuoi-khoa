require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/users/user.router");
const productRouter = require("./api/products/product.router");
const productDetailRouter = require("./api/productDetail/productDetail.router");
const productDetailSizeRouter = require("./api/productDetailSize/productDetailSize.router");
const productImagesRouter = require("./api/productImage/productImage.router");
const addressUsersRouter = require("./api/addressUsers/addressUsers.router");
const orderProductsRouter = require("./api/ordersProduct/ordersProduct.router");
//addressUser
// app.get("/", (req, res) => {
//   res.json({
//     success: 1,
//     message: "This is rest api working",
//   });
// });
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/productDetail", productDetailRouter);
app.use("/api/productDetailSize", productDetailSizeRouter);
app.use("/api/productImages", productImagesRouter);
app.use("/api/addressUsers", addressUsersRouter);
app.use("/api/orderProducts", orderProductsRouter);
app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running on Port: " + process.env.APP_PORT);
});
