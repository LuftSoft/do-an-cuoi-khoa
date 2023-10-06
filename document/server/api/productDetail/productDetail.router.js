const {
  createProductsDetail,
  getProductsDetailById,
  getProductsDetail,
  updateProductsDetail,
  deleteProductsDetail,
} = require("./productDetail.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createProductsDetail);
// router.get("/", checktoken, getProductsDetail);
// router.get("/:id", checktoken, getProductsDetailById);
// router.patch("/", checktoken, updateProductsDetail);
// router.delete("/", checktoken, deleteProductsDetail);

router.post("/", createProductsDetail);
router.get("/", getProductsDetail);
router.get("/:id", getProductsDetailById);
router.patch("/", updateProductsDetail);
router.delete("/", deleteProductsDetail);

module.exports = router;
