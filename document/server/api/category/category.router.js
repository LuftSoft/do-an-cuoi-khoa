const {
  createCategory,
  getCategoryById,
  getCategorys,
  updateCategory,
  deleteCategory,
} = require("./category.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createCategory);
// router.get("/", checktoken, getCategorys);
// router.get("/:id", checktoken, getCategoryById);
// router.patch("/", checktoken, updateCategory);
// router.delete("/", checktoken, deleteCategory);
router.post("/", createCategory);
router.get("/", getCategorys);
router.get("/:id", getCategoryById);
router.patch("/", updateCategory);
router.delete("/", deleteCategory);

module.exports = router;
