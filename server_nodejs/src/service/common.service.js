const credit_classRepository = require("../repository/credit_class.repository");
const BaseAPIResponse = require("../dto/baseApiResponse");
const { CONFIG } = require("../shared/common.constants");
const { Helpers, logger } = require("../extension/helper");
const commonRepository = require("../repository/common.repository");
const authService = require("./common/auth.service");
module.exports = {
  getFourTopInfo: async () => {
    try {
      var data = await commonRepository.getFourTopInfo();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all chapter failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getPieChartMark: async () => {
    try {
      var data = await commonRepository.getPieChartMark();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all chapter failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  getBarChartSemester: async () => {
    try {
      var data = await commonRepository.getBarChartSemester();
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.SUCCESS,
        data,
        null
      );
    } catch (err) {
      logger.error("get all chapter failed!");
      console.log(err);
      return new BaseAPIResponse(
        CONFIG.RESPONSE_STATUS_CODE.ERROR,
        null,
        err.message
      );
    }
  },
  CHECK_USER_TOKEN: (accessToken, res) => {
    try {
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
        return false;
      } else {
        return userId;
      }
    } catch (e) {
      res.send(
        new BaseAPIResponse(
          "NOT AUTHORIZE",
          null,
          "Không có quyền truy cập tài nguyên"
        )
      );
      return false;
    }
  },
};
