const {
  createReceipt,
  getReceiptById,
  getReceipts,
  updateReceipt,
  deleteReceipt,
} = require("./receipt.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
router.post("/", checktoken, createReceipt);
router.get("/", checktoken, getReceipts);
router.get("/:id", checktoken, getReceiptById);
router.patch("/", checktoken, updateReceipt);
router.delete("/", checktoken, deleteReceipt);

module.exports = router;
