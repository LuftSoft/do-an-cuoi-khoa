const {
  createProduct,
  getProductById,
  getProducts,
  getAllProductWithPrice,
  getAllProductWithPriceByAgetypesId,
  updateProduct,
  deleteProduct,
} = require("./product.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createProduct);
// router.get("/", checktoken, getProducts);
// router.get("/:id", checktoken, getProductById);
// router.patch("/", checktoken, updateProduct);
// router.delete("/", checktoken, deleteProduct);

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/getAllProductWithPrice", getAllProductWithPrice);
router.get("/getAllProductWithPrice/:id", getAllProductWithPriceByAgetypesId);
router.get("/:id", getProductById);
router.patch("/", updateProduct);
router.delete("/", deleteProduct);

module.exports = router;
