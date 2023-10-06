const {
  createaddressUser,
  getaddressUserById,
  getaddressUsers,
  updateaddressUser,
  deleteaddressUser,
} = require("./addressUsers.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createaddressUser);
// router.get("/", checktoken, getaddressUsers);
// router.get("/:id", checktoken, getaddressUserById);
// router.patch("/", checktoken, updateaddressUser);
// router.delete("/", checktoken, deleteaddressUser);
router.post("/", createaddressUser);
router.get("/", getaddressUsers);
router.get("/:id", getaddressUserById);
router.patch("/", updateaddressUser);
router.delete("/", deleteaddressUser);

module.exports = router;
