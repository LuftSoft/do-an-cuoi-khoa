const {
  createProductsDetailSize,
  getProductsDetailSizeById,
  getProductsDetailSize,
  updateProductsDetailSize,
  deleteProductsDetailSize,
} = require("./productDetailSize.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
router.post("/", checktoken, createProductsDetailSize);
router.get("/", checktoken, getProductsDetailSizeById);
router.get("/:id", checktoken, getProductsDetailSize);
router.patch("/", checktoken, updateProductsDetailSize);
router.delete("/", checktoken, deleteProductsDetailSize);

module.exports = router;
