const {
  createshopcart,
  getshopcartById,
  getshopcartByProductId,
  getshopcartByuserId,
  getshopcarts,
  updatequantityshopcart,
  updateshopcart,
  deleteshopcart,
} = require("./shopcarts.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createshopcart);
// router.get("/", checktoken, getshopcarts);
// router.get("/:id", checktoken, getshopcartById);
// router.patch("/", checktoken, updateshopcart);
// router.delete("/", checktoken, deleteshopcart);
router.post("/", createshopcart);
router.get("/", getshopcarts);
router.get("/:id", getshopcartById);
router.get("/getbyuserid/:userId", getshopcartByuserId);
router.get("/getbyproductid/:id", getshopcartByProductId);
router.patch("/", updateshopcart);
router.put("/", updatequantityshopcart);
router.delete("/:id", deleteshopcart);
module.exports = router;
