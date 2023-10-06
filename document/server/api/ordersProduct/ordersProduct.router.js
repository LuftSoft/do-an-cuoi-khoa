const {
  createorderProducts,
  getorderProductsById,
  getorderProductsByUserId,
  getorderProducts,
  updateorderProduct,
  deleteorderProduct,
} = require("./ordersProduct.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createorderProducts);
// router.get("/", checktoken, getorderProducts);
// router.get("/:id", checktoken, getorderProductsById);
// router.patch("/", checktoken, updateorderProduct);
// router.delete("/", checktoken, deleteorderProduct);

router.post("/", createorderProducts);
router.get("/", getorderProducts);
router.get("/userid/:userid", getorderProductsByUserId);
router.get("/:id", getorderProductsById);
router.patch("/", updateorderProduct);
router.delete("/", deleteorderProduct);

module.exports = router;
