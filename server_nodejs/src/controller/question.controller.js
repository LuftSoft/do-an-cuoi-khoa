const express = require("express");
const questionService = require("../service/question.service");
const { authorize } = require("../extension/middleware/application.middleware");
const authService = require("../service/common/auth.service");
const commonService = require("../service/common.service");
const { uploadUtil } = require("../util/upload.util");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send(await questionService.getAll());
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await questionService.getOne(id));
});

router.post("/", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = authService.getUserIdFromJWTToken(
    accessToken,
    process.env.SECRET_TOKEN_KEY
  );
  if (!userId) {
    res.send(
      new BaseAPIResponse(
        "NOT AUTHORIZE",
        null,
        "Không có quyền truy cập tài nguyên"
      )
    );
  } else {
    const subject = req.body;
    subject.userId = userId;
    res.send(await questionService.create(subject));
  }
});

router.post(
  "/import",
  authorize([]),
  uploadUtil.upload.single("file"),
  async (req, res) => {
    const accessToken = req.accessToken;
    const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
    if (userId) {
      const file = req.file;
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="import_question_result.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(await questionService.import(file));
    }
  }
);

router.post("/export", authorize([]), async (req, res) => {
  const accessToken = req.accessToken;
  const userId = commonService.CHECK_USER_TOKEN(accessToken, res);
  if (userId) {
    res.send(await questionService.export());
  }
});

router.put("/", async (req, res) => {
  const subject = req.body;
  res.send(await questionService.update(subject));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await questionService.delete(id));
});

module.exports = router;
