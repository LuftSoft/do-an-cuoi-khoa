require("dotenv").config();
const express = require("express");

const app = express();
const cors = require("cors");
const userRouter = require("./api/users/user.router");
const productRouter = require("./api/products/product.router");
const productDetailRouter = require("./api/productDetail/productDetail.router");
const productDetailSizeRouter = require("./api/productDetailSize/productDetailSize.router");
const productImagesRouter = require("./api/productImage/productImage.router");
const addressUsersRouter = require("./api/addressUsers/addressUsers.router");
const orderProductsRouter = require("./api/ordersProduct/ordersProduct.router");
const orderProductsDetailsRouter = require("./api/ordersProductDetail/ordersProductDetail.router");
const brandRouter = require("./api/brand/brand.router");
const receiptRouter = require("./api/receipt/receipt.router");
const receiptDetailsRouter = require("./api/receiptdetail/receiptdetail.router");
const shopcartsRouter = require("./api/shopcarts/shopcarts.router");
const wishlistsRouter = require("./api/wistList/wistlist.router");
const agetypesRouter = require("./api/agetypes/agetypes.router");
const categorysRouter = require("./api/category/category.router");

//addressUser
// app.get("/", (req, res) => {
//   res.json({
//     success: 1,
//     message: "This is rest api working",
//   });
// });
app.use(cors("*"));
app.use(express.json());
app.use(express.static("uploads"));
app.use("/images", express.static("uploads"));
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/productDetail", productDetailRouter);
app.use("/api/productDetailSize", productDetailSizeRouter);
app.use("/api/productImages", productImagesRouter);
app.use("/api/addressUsers", addressUsersRouter);
app.use("/api/orderProducts", orderProductsRouter);
app.use("/api/orderProductDetails", orderProductsDetailsRouter);
app.use("/api/brands", brandRouter);
app.use("/api/receipts", receiptRouter);
app.use("/api/receiptdetails", receiptDetailsRouter);
app.use("/api/shopcarts", shopcartsRouter);
app.use("/api/wishlists", wishlistsRouter);
app.use("/api/agetypes", agetypesRouter);
app.use("/api/categorys", categorysRouter);

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running on Port: " + process.env.APP_PORT);
});
