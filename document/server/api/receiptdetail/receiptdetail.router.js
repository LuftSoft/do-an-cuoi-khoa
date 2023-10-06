const {
  createReceiptDetail,
  getReceiptDetailById,
  getReceiptDetails,
  updateReceiptDetail,
  deleteReceiptDetail,
} = require("./receiptdetail.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
router.post("/", checktoken, createReceiptDetail);
router.get("/", checktoken, getReceiptDetails);
router.get("/:id", checktoken, getReceiptDetailById);
router.patch("/", checktoken, updateReceiptDetail);
router.delete("/", checktoken, deleteReceiptDetail);

module.exports = router;
