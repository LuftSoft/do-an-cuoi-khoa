const express = require("express");
const creditClassService = require("../service/credit_class.service");
const creditClassDetailService = require("../service/credit_classes_detail.service");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await creditClassService.getAll());
});

router.get("/assign/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassService.getAllAssign(id));
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassService.getOne(id));
});

router.post("/", async (req, res) => {
  const creditClass = req.body;
  res.send(await creditClassService.create(creditClass));
});

router.put("/", async (req, res) => {
  const creditClass = req.body;
  res.send(await creditClassService.update(creditClass));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassService.delete(id));
});
//
/**/
router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassDetailService.getListUserClass(id));
});
router.post("/user", async (req, res) => {
  const user_class = req.body;
  res.send(await creditClassDetailService.createUserClass(user_class));
});

router.post("/user/list", async (req, res) => {
  const data = req.body;
  res.send(await creditClassDetailService.createListUserClass(data));
});

router.put("/user", async (req, res) => {
  const group = req.body;
  res.send(await creditClassDetailService.banUserGroup(group));
});

router.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await creditClassDetailService.deleteUserClass(id));
});
module.exports = router;
