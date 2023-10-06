const {
  createAgetype,
  getAgetypeById,
  getAgetypes,
  updateAgetype,
  deleteAgetype,
} = require("./agetypes.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createAgetype);
// router.get("/", checktoken, getAgetypes);
// router.get("/:id", checktoken, getAgetypeById);
// router.patch("/", checktoken, updateAgetype);
// router.delete("/", checktoken, deleteAgetype);
router.post("/", createAgetype);
router.get("/", getAgetypes);
router.get("/:id", getAgetypeById);
router.patch("/", updateAgetype);
router.delete("/", deleteAgetype);

module.exports = router;
