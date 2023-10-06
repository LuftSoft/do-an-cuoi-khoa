const {
  createBrand,
  getBrandById,
  getBrands,
  updateBrand,
  deleteBrand,
} = require("./brand.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
router.post("/", checktoken, createBrand);
router.get("/", checktoken, getBrands);
router.get("/:id", checktoken, getBrandById);
router.patch("/", checktoken, updateBrand);
router.delete("/", checktoken, deleteBrand);

module.exports = router;
