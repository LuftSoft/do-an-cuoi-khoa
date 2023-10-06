const {
  createorderProductDetail,
  getorderProductDetailById,
  getorderProductDetailByOrderId,
  getorderProductDetailByUserId,
  getorderProductDetail,
  updateorderProductDetail,
  deleteorderProductDetail,
} = require("./ordersProductDetail.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createorderProductDetail);
// router.get("/", checktoken, getorderProductDetail);
// router.get("/:id", checktoken, getorderProductDetail);
// router.patch("/", checktoken, updateorderProductDetail);
// router.delete("/", checktoken, deleteorderProductDetail);

router.post("/", createorderProductDetail);
router.get("/", getorderProductDetail);
router.get("/orderid/:id", getorderProductDetailByOrderId);
router.get("/userid/:id", getorderProductDetailByUserId);
router.get("/:id", getorderProductDetailById);

router.patch("/", updateorderProductDetail);
router.delete("/", deleteorderProductDetail);

module.exports = router;
