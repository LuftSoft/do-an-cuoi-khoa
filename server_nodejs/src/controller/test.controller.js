const express = require("express");
const testService = require("../service/test.service");
const { authorize } = require("../extension/middleware/application.middleware");
const authService = require("../service/common/auth.service");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await testService.getAll());
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.getOne(id));
});

router.post("/", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = authService.getUserIdFromJWTToken(
    accessToken,
    process.env.SECRET_TOKEN_KEY
  );
  const test = req.body;
  test.user_id = userId;
  res.send(await testService.create(test));
});

router.put("/", async (req, res) => {
  const test = req.body;
  res.send(await testService.update(test));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.delete(id));
});

/* API giao đề thi cho từng nhóm */
router.post("/credit-class", async (req, res) => {
  const testGroup = req.body;
  res.send(await testService.createTestGroup(testGroup));
});
/*
Nếu đã có bài nộp thì không được sửa
*/
router.put("/credit-class", async (req, res) => {
  const testGroup = req.body;
  res.send(await testService.updateTestGroup(testGroup));
});
/*
Nếu có bài làm rồi thì sẽ không được xóa.
Admin or người tạo có thể xóa
*/
router.delete("/credit-class/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.updateTestGroup(id));
});

/* API CRUD câu hỏi cho đề thi */
router.post("/question", async (req, res) => {
  const testQuestion = req.body;
  res.send(await testService.createTestQuestion(testQuestion));
});

router.put("/question", async (req, res) => {
  const testQuestion = req.body;
  res.send(await testService.updateTestQuestion(testQuestion));
});

router.delete("/question/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await testService.deleteTestQuestion(id));
});

module.exports = router;
