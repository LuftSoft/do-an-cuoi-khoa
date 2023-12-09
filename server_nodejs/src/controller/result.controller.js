const express = require("express");
const resultService = require("../service/result.service");
const resultDetailService = require("../service/result_detail.service");
const { authorize } = require("../extension/middleware/application.middleware");
const authService = require("../service/common/auth.common.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const router = express.Router();
//get all test-credit-class
router.get("/", async (req, res) => {
  res.send(await resultService.getAll());
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.getByUserId(id));
});

router.get("/test-credit-classes/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.getByTestCreditClassesId(id));
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("get here");
  res.send(await resultService.getOne(id));
});

router.post("/export/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.exportTranscript(id));
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
    const result = req.body;
    console.log(result);
    console.log(userId);
    result.user_id = userId;
    res.send(await resultService.create(result));
    //res.send(new BaseAPIResponse("SUCCESS", result, "Thanh cong"));
  }
});

router.put("/", async (req, res) => {
  const result = req.body;
  res.send(await resultService.update(result));
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultService.delete(id));
});

/* Chi tiet ket qua */
router.get("/detail", async (req, res) => {
  res.send(await resultDetailService.getAll());
});

router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultDetailService.getOne(id));
});

router.post("/detail", async (req, res) => {
  const result = req.body;
  res.send(await resultDetailService.create(result));
});

router.put("/detail", async (req, res) => {
  const result = req.body;
  res.send(await resultDetailService.update(result));
});

router.delete("/detail/:id", async (req, res) => {
  const id = req.params.id;
  res.send(await resultDetailService.delete(id));
});

module.exports = router;
