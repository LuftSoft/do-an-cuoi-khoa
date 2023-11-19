const express = require("express");
const assignService = require("../service/assign.service");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { authorize } = require("../extension/middleware/application.middleware");
const { logger, Helpers } = require("../extension/helper");
const router = express.Router();
const { CONFIG } = require("../shared/common.constants");
const commonService = require("../service/common.service");

//get numOfTotalQuestion, numOfTotalTest, numOfTotalTestExam, numOfTotalUser
router.get("/overview/info", async (req, res) => {
  res.send(await commonService.getFourTopInfo());
});

router.get("/overview/pie", async (req, res) => {
  res.send(await commonService.getPieChartMark());
});

router.get("/overview/bar", async (req, res) => {
  res.send(await commonService.getBarChartSemester());
});

module.exports = router;
