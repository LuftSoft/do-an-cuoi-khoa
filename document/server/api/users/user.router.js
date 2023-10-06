const {
  createUser,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  login,
} = require("./user.controller");
const router = require("express").Router();
const { checktoken } = require("../../auth/token_validation");

//router.post("/", checktoken, createUser);
// router.post("/", checktoken, createUser);
// router.get("/", checktoken, getUsers);
// router.get("/:id", checktoken, getUserByUserId);
// router.patch("/", checktoken, updateUser);
// router.delete("/", checktoken, deleteUser);
// router.post("/login", login);

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:user_id", getUserByUserId);
router.patch("/", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", login);

module.exports = router;
