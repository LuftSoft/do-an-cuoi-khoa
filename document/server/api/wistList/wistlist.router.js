const {
  createwishList,
  getwishListById,
  getwishListByProductId,
  getwishList,

  updatewishList,
  deletewishList,
} = require("./wistlist.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createshopcart);
// router.get("/", checktoken, getshopcarts);
// router.get("/:id", checktoken, getshopcartById);
// router.patch("/", checktoken, updateshopcart);
// router.delete("/", checktoken, deleteshopcart);
router.post("/", createwishList);
router.get("/userid/:userId", getwishList);
router.get("/:id", getwishListById);
router.get("/getbyproductid/:id", getwishListByProductId);
router.patch("/", updatewishList);

router.delete("/:id", deletewishList);
module.exports = router;
